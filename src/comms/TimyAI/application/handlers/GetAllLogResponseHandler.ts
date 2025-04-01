import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIContinueAllLogRequest } from '../../types/commands';
import { TimyAIGetAllLogResponse } from '../../types/responses';

/**
 * Handles the response to a getAllLog request
 */
export class GetAllLogResponseHandler implements ITimyAIMessageHandler {
    /**
     * Handle a getAllLog response
     * @param ws - The WebSocket connection
     * @param message - The getAllLog response
     * @param protocolEmitter - The event emitter for the protocol
     */
    handle(ws: WebSocket, message: TimyAIGetAllLogResponse, protocolEmitter: EventEmitter): void {
        if (!message.commandSuccessful) {
            console.error(`GetAllLog failed for terminal ${message.serialNumber}: ${message.errorMessage}`);
            // probably emit a failure event
            protocolEmitter.emit('getAllLogError', { 
                terminalSN: message.serialNumber, 
                error: message.errorMessage 
            });
            return;
        }

        console.log(`Received log batch [${message.from}-${message.to}] of ${message.count} from ${message.serialNumber}`);

        // Process the received records
        for (const record of message.records) {
            console.log(`  Log: ID=${record.enrollmentId}, Name=${record.name || 'N/A'}, Time=${record.time}`);
            /**
             * @todo
             * Save the log record to DB and send to Evo
             */
        }
        
        // Maybe used batches in future to reduce API Requests.
        protocolEmitter.emit('logBatchReceived', { 
            terminalSN: message.serialNumber, 
            records: message.records, 
            from: message.from,
            to: message.to,
            total: message.count
         });

        const moreLogsExist = message.to < message.count - 1;

        if (moreLogsExist) {
            console.log(`Requesting next batch of logs from ${message.serialNumber}...`);
            
            const continueRequest = new TimyAIContinueAllLogRequest();
            const plainRequest = instanceToPlain(continueRequest);

            try {
                ws.send(JSON.stringify(plainRequest));
            } catch (error) {
                console.error(`Error sending next getalllog request to ${message.serialNumber}:`, error);
            }
        } else {
            console.log(`Finished receiving all logs (${message.count}) from ${message.serialNumber}.`);
            protocolEmitter.emit('allLogsReceived', { terminalSN: message.serialNumber, total: message.count });
        }
    }
} 