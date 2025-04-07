import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIContinueAllLogRequest } from '../../types/commands';
import { TimyAIGetAllLogResponse } from '../../types/responses';
import { injectable } from 'tsyringe';
import { createLogger } from '@/utils/logger';

/**
 * Handles the response to a getAllLog request
 */
@injectable()
export class GetAllLogResponseHandler implements ITimyAIMessageHandler {
    private readonly logger = createLogger('GetAllLogResponseHandler');
    
    /**
     * Handle a getAllLog response
     * @param ws - The WebSocket connection
     * @param message - The getAllLog response
     * @param protocolEmitter - The event emitter for the protocol
     */
    async handle(ws: WebSocket, message: TimyAIGetAllLogResponse, protocolEmitter: EventEmitter): Promise<void> {
        this.logger.info(`Received getAllLog response from ${message.serialNumber}`);

        if (!message.commandSuccessful) {
            await this.emitGetAllLogError(message, protocolEmitter);
            return;
        }

        this.logger.info(`Received log batch [${message.from}-${message.to}] of ${message.count} from ${message.serialNumber}`);

        await this.saveLogsToDB(message.records, message.serialNumber);
        await this.emitLogBatchReceived(message, protocolEmitter);


        if (message.to < message.count) {
            this.logger.info(`Requesting next batch of logs from ${message.serialNumber}...`);
            
            
        } else {
            this.logger.info(`Finished receiving all logs (${message.count}) from ${message.serialNumber}.`);
            protocolEmitter.emit('allLogsReceived', { terminalSN: message.serialNumber, total: message.count });
        }
    }

    /**
     * Save the logs to the database
     * @param records - The logs to save
     * @param serialNumber - The serial number of the terminal
     * @todo - Implement this
     */
    private async saveLogsToDB(records: TimyAIGetAllLogResponse['records'], serialNumber: string): Promise<void> {
        for (const record of records) {
            this.logger.info(`Recieved Clocking: ID=${record.enrollmentId}, Name=${record.name || 'N/A'}, Time=${record.time} from ${serialNumber}`);
        }
    }

    /**
     * Send the next getAllLog request
     * @param message - The message to send
     * @param ws - The WebSocket connection
     */
    private async sendNextGetAllLogRequest(message: TimyAIGetAllLogResponse, ws: WebSocket): Promise<void> {
        const continueRequest = new TimyAIContinueAllLogRequest().toPlain();
        try {
            ws.send(continueRequest);
        } catch (error) {
            this.logger.error(`Error sending next getalllog request to ${message.serialNumber}:`, error);
        }
    }

    /**
     * Emit error event for getAllLog
     * @param message - The message to emit
     * @param protocolEmitter - The event emitter for the protocol
     */
    private async emitGetAllLogError(message: TimyAIGetAllLogResponse, protocolEmitter: EventEmitter): Promise<void> {
        this.logger.error(`GetAllLog failed for terminal ${message.serialNumber}: ${message.errorMessage}`);
        protocolEmitter.emit('getAllLogError', { 
            terminalSN: message.serialNumber, 
            error: message.errorMessage 
        });
    }

    /**
     * Emit the log batch received event
     * @param message - The message to emit
     * @param protocolEmitter - The event emitter for the protocol
     */
    private async emitLogBatchReceived(message: TimyAIGetAllLogResponse, protocolEmitter: EventEmitter): Promise<void> {
        protocolEmitter.emit('logBatchReceived', { 
            terminalSN: message.serialNumber, 
            records: message.records, 
            from: message.from,
            to: message.to,
            total: message.count
        });
    }
} 