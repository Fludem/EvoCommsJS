import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { TimyAISendUserRequest, TimyAISendUserResponse } from '../types';

export class UserDataHandler implements ITimyAIMessageHandler {
    handle(ws: WebSocket, message: TimyAISendUserRequest, protocolEmitter: EventEmitter): void {
        // Use camelCase properties
        console.log(`Received user data for enrollid: ${message.enrollmentId}`);
        
        protocolEmitter.emit('userDataReceived', {
            enrollId: message.enrollmentId,
            name: message.name,
            backupNum: message.backupNumber, // Use mapped name
            admin: message.admin,
            record: message.record
        });

        // Create response instance
        const responseInstance = new TimyAISendUserResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        // Convert instance to plain object for sending
        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
    }
} 