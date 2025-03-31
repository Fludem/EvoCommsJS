import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { TimyAIRegisterRequest } from '../../types/commands';
import { TimyAIRegisterResponse } from '../../types/responses';
import { TimyTerminal } from '../../types/shared';

export class RegistrationHandler implements ITimyAIMessageHandler {
    

    handle(ws: WebSocket, message: TimyAIRegisterRequest, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void {
        
        const terminal: TimyTerminal = {
            serialNumber: message.serialNumber,
            cpuSerialNumber: message.cpuSerialNumber,
            deviceInfo: message.deviceInfo
        };

        connectedTerminals.set(terminal.serialNumber, ws);
        console.log(`Terminal registered: ${terminal.serialNumber} (${message.deviceInfo.modelName ?? 'Unknown Model'})`);

        const responseInstance = new TimyAIRegisterResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        responseInstance.syncNewUsers = true;

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
        protocolEmitter.emit('terminalRegistered', terminal);
    }
} 