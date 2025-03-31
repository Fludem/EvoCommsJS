import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { TimyAISendQRCodeRequest, TimyAISendQRCodeResponse } from '../types';

export class QRCodeHandler implements ITimyAIMessageHandler {
    handle(ws: WebSocket, message: TimyAISendQRCodeRequest, protocolEmitter: EventEmitter): void {
        // Use camelCase properties
        console.log(`Received QR code from ${message.serialNumber}: ${message.record}`);
        
        protocolEmitter.emit('qrCodeReceived', {
            terminalSN: message.serialNumber,
            code: message.record
        });

        // Create response instance
        const responseInstance = new TimyAISendQRCodeResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.access = 1;
        responseInstance.enrollmentId = 0;
        responseInstance.username = '';
        responseInstance.message = 'QR Code received';

        // Convert instance to plain object for sending
        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
    }
} 