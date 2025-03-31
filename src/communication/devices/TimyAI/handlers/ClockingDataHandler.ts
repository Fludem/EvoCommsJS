import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { TimyAISendLogRequest, TimyAISendLogResponse } from '../types';

export class ClockingDataHandler implements ITimyAIMessageHandler {
    handle(ws: WebSocket, message: TimyAISendLogRequest, protocolEmitter: EventEmitter): void {
        // Use camelCase properties from the message instance
        console.log(`Received ${message.count} clocking(s) from ${message.serialNumber}`);
        
        protocolEmitter.emit('clockingReceived', {
            terminalSN: message.serialNumber,
            clockings: message.records, // Use mapped name 'records'
            logIndex: message.logIndex
        });

        // Create response instance
        const responseInstance = new TimyAISendLogResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.count = message.count;
        responseInstance.logIndex = message.logIndex;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        // Convert instance to plain object for sending
        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
    }
} 