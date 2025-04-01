import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAISendUserRequest } from '../../types/commands';
import { TimyAISendUserResponse } from '../../types/responses';

/**
 * Handles user data from a TimyAI terminal
 */
export class UserDataHandler implements ITimyAIMessageHandler {
    /**
     * Handle a user data message
     * @param ws - The WebSocket connection
     * @param message - The user data message
     * @param protocolEmitter - The event emitter for the protocol
     */
    handle(ws: WebSocket, message: TimyAISendUserRequest, protocolEmitter: EventEmitter): void {
        console.log(`Received user data for enrollid: ${message.enrollmentId}`);
        
        protocolEmitter.emit('userDataReceived', {
            enrollId: message.enrollmentId,
            name: message.name,
            backupNum: message.backupNumber,
            admin: message.admin,
            record: message.record
        });

        const responseInstance = new TimyAISendUserResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
    }
} 