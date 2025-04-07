import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { injectable, inject } from 'tsyringe';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIRegisterRequest } from '../../types/commands';
import { TimyAIRegisterResponse } from '../../types/responses';
import { TerminalConnectedDetails, TimyTerminal } from '../../types/shared';
import { createLogger } from '../../../../utils/logger';
import { Terminal, TerminalRepository } from '../../../../repositories/terminal.repository';
import { TerminalResolutionService } from '../../../../services/terminal-resolution.service';
import { ActivityLogService } from '../../../../services/activity-log.service';

// Interface for internal WebSocket with socket access
interface ExtendedWebSocket extends WebSocket {
    _socket?: {
        remoteAddress?: string;
    };
}

/**
 * Handles the registration of a TimyAI terminal
 */
@injectable()
export class RegistrationHandler implements ITimyAIMessageHandler {
    private readonly logger = createLogger('RegistrationHandler');
    
    constructor(
        @inject(TerminalResolutionService) private terminalResolutionService: TerminalResolutionService
    ) {}
    
    /**
     * Handle a registration message usually sent when device connects
     * @param ws - The WebSocket connection
     * @param message - The registration message
     * @param protocolEmitter - The event emitter for the protocol
     */
    async handle(ws: WebSocket, message: TimyAIRegisterRequest, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): Promise<void> {
        
        const terminal: TimyTerminal = {
            serialNumber: message.serialNumber,
            cpuSerialNumber: message.cpuSerialNumber,
            deviceInfo: message.deviceInfo
        };

        const customerId = await this.terminalResolutionService.resolveTerminalOwner(terminal.serialNumber);

        if (!customerId) {
            this.logger.error(`Terminal ${terminal.serialNumber} not found in EvoTime API or failed to create customer`);
            ws.close();
            return;
        }

        const dbTerminal = await this.upsertTerminal(terminal, customerId);

        if (!dbTerminal) {
            this.logger.error(`Failed to upsert terminal in database: ${terminal.serialNumber}`);
            ws.close();
            return;
        }
        this.logTerminalConnected(terminal, dbTerminal, ws);
        const responseMessage = new TimyAIRegisterResponse(message).toPlain();
        ws.send(responseMessage);

        connectedTerminals.set(terminal.serialNumber, ws);
        this.logger.info(`Terminal registered: ${terminal.serialNumber} (${message.deviceInfo.modelName ?? 'Unknown Model'})`);    
        protocolEmitter.emit('terminalRegistered', terminal);
    }

    private async upsertTerminal(terminal: TimyTerminal, customerId: number) {
        return await TerminalRepository.upsert({
            serial_number: terminal.serialNumber,
            firmware: terminal.deviceInfo.firmware ?? 'unknown',
            terminal_type: 'TIMYAI',
            customer_id: Number(customerId)
        });
    }

    private async logTerminalConnected(terminal: TimyTerminal, dbTerminal: Terminal, ws: WebSocket) {
        const extendedWs = ws as ExtendedWebSocket;
        const ipAddress = extendedWs._socket?.remoteAddress || 'Unknown';

        const terminalConnectedDetails: TerminalConnectedDetails = {
            serialNumber: terminal.serialNumber,
            cpuSerialNumber: terminal.cpuSerialNumber,
            deviceInfo: terminal.deviceInfo,
            customerId: dbTerminal.customer_id,
            customerName: "TODO: Get customer name",
            ipAddress: ipAddress
        };

        ActivityLogService.logTerminalConnected(
            dbTerminal,
            terminalConnectedDetails
        );
    }
} 