import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { injectable } from 'tsyringe';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIRegisterRequest } from '../../types/commands';
import { TimyAIRegisterResponse } from '../../types/responses';
import { TimyTerminal } from '../../types/shared';
import { createLogger } from '../../../../utils/logger';

/**
 * Handles the registration of a TimyAI terminal
 */
@injectable()
export class RegistrationHandler implements ITimyAIMessageHandler {
    private readonly logger = createLogger('RegistrationHandler');
    
    constructor() {}
    
    /**
     * Handle a registration message usually sent when device connects
     * @param ws - The WebSocket connection
     * @param message - The registration message
     * @param protocolEmitter - The event emitter for the protocol
     */
    handle(ws: WebSocket, message: TimyAIRegisterRequest, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void {
        
        const terminal: TimyTerminal = {
            serialNumber: message.serialNumber,
            cpuSerialNumber: message.cpuSerialNumber,
            deviceInfo: message.deviceInfo
        };

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