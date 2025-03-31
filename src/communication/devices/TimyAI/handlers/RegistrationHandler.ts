import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './ITimyAIMessageHandler';
import { Terminal, DeviceInfo } from '../../../../types/terminal';
import { TimyAIRegisterRequest, TimyAIRegisterResponse } from '../types';

export class RegistrationHandler implements ITimyAIMessageHandler {
    
    private extractDeviceInfo(devinfo: any): DeviceInfo {
        return {
            modelName: devinfo.modelname || '',
            usedUsers: devinfo.useduser || 0,
            usedFace: devinfo.usedface || 0, // Assuming usedface might exist
            usedLogs: devinfo.usedlog || 0,
            time: devinfo.time || new Date().toISOString(),
            firmware: devinfo.firmware || '',
            macAddress: devinfo.mac || ''
        };
    }

    handle(ws: WebSocket, message: TimyAIRegisterRequest, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void {
        const deviceInfo = this.extractDeviceInfo(message.deviceInfo);
        
        const terminal: Terminal = {
            serialNumber: message.serialNumber,
            cpuSerialNumber: message.cpuSerialNumber,
            deviceInfo
        };

        connectedTerminals.set(terminal.serialNumber, ws);
        console.log(`Terminal registered: ${terminal.serialNumber} (${deviceInfo.modelName})`);

        const responseInstance = new TimyAIRegisterResponse();
        responseInstance.commandSuccessful = true;
        responseInstance.cloudTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        responseInstance.syncNewUsers = true;

        const plainResponse = instanceToPlain(responseInstance);
        
        ws.send(JSON.stringify(plainResponse));
        protocolEmitter.emit('terminalRegistered', terminal);
    }
} 