import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { Terminal } from '../../../../types/terminal';
import { TimyAIRegisterRequest, TimyAIRegisterResponse } from '../types';

export class RegistrationHandler implements ITimyAIMessageHandler {
    

    handle(ws: WebSocket, message: TimyAIRegisterRequest, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void {
        
        const terminal: Terminal = {
            serialNumber: message.serialNumber,
            cpuSerialNumber: message.cpuSerialNumber,
            deviceInfo: message.deviceInfo
        };

        connectedTerminals.set(terminal.serialNumber, ws);
        console.log(`Terminal registered: ${terminal.serialNumber} (${message.deviceInfo.modelName})`);

        const responseInstance = new TimyAIRegisterResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        responseInstance.syncNewUsers = true;

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
        protocolEmitter.emit('terminalRegistered', terminal);
    }
} 