import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { injectable, inject } from 'tsyringe';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIRegisterRequest } from '../../types/commands';
import { TimyAIRegisterResponse } from '../../types/responses';
import { TimyTerminal } from '../../types/shared';
import { createLogger } from '../../../../utils/logger';
import { TerminalRepository } from '../../../../repositories/terminal.repository';
import { TerminalResolutionService } from '../../../../services/terminal-resolution.service';

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

        // Resolve customer information from EvoTime API
        const customerId = await this.terminalResolutionService.resolveTerminal(terminal.serialNumber);

        if (!customerId) {
            this.logger.error(`Terminal ${terminal.serialNumber} not found in EvoTime API or failed to create customer`);
            ws.close();
            return;
        }

        // Update or create terminal in database
        const dbTerminal = await TerminalRepository.upsert({
            serial_number: terminal.serialNumber,
            firmware: terminal.deviceInfo.firmware ?? 'unknown',
            terminal_type: 'TIMYAI',
            customer_id: Number(customerId)
        });

        if (!dbTerminal) {
            this.logger.error(`Failed to upsert terminal in database: ${terminal.serialNumber}`);
            ws.close();
            return;
        }

        connectedTerminals.set(terminal.serialNumber, ws);
        this.logger.info(`Terminal registered: ${terminal.serialNumber} (${message.deviceInfo.modelName ?? 'Unknown Model'})`);

        const responseInstance = new TimyAIRegisterResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        responseInstance.syncNewUsers = true;

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
        protocolEmitter.emit('terminalRegistered', terminal);
    }
} 