import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { injectable } from 'tsyringe';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAISendLogRequest } from '../../types/commands';
import { TimyAISendLogResponse } from '../../types/responses';
import { createLogger } from '../../../../utils/logger';

/**
 * Handles clocking data from a TimyAI terminal
 */
@injectable()
export class ClockingDataHandler implements ITimyAIMessageHandler {
    private readonly logger = createLogger('ClockingDataHandler');
    
    constructor() {}
    
    /**
     * Handle a clocking data message
     * @param ws - The WebSocket connection
     * @param message - The clocking data message
     * @param protocolEmitter - The event emitter for the protocol
     */
    handle(ws: WebSocket, message: TimyAISendLogRequest, protocolEmitter: EventEmitter): void {
        this.logger.info(`Received ${message.count} clocking(s) from ${message.serialNumber}`);
        
        protocolEmitter.emit('clockingReceived', {
            terminalSN: message.serialNumber,
            clockings: message.records,
            logIndex: message.logIndex
        });

        const responseInstance = new TimyAISendLogResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.count = message.count;
        responseInstance.logIndex = message.logIndex;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
    }
} 