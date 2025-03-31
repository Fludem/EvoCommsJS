import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { TimyAIGetAllLogResponse, TimyAIContinueAllLogRequest } from '../types';

export class GetAllLogResponseHandler implements ITimyAIMessageHandler {
    
    handle(ws: WebSocket, message: TimyAIGetAllLogResponse, protocolEmitter: EventEmitter): void {
        if (!message.commandSuccessful) {
            console.error(`GetAllLog failed for terminal ${message.serialNumber}: ${message.errorMessage}`);
            // Potentially emit a failure event
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
            // Here you would typically save the log record to a database or process it further
        }
        
        // Emit an event with the batch (optional)
        protocolEmitter.emit('logBatchReceived', { 
            terminalSN: message.serialNumber, 
            records: message.records, 
            from: message.from,
            to: message.to,
            total: message.count
         });

        // Check if more logs are expected (indices are 0-based)
        const moreLogsExist = message.to < message.count - 1;

        if (moreLogsExist) {
            console.log(`Requesting next batch of logs from ${message.serialNumber}...`);
            
            // Construct the follow-up request  
            const continueRequest = new TimyAIContinueAllLogRequest();
            // Convert to plain object matching device format
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