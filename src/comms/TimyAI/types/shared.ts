import { TimyAIGetAllLogRequest, TimyAIRegisterRequest, TimyAISendUserRequest, TimyAISetUserInfoRequest } from "./commands";
import { TimyAIContinueAllLogRequest, TimyAIGetUserListRequest, TimyAISendLogRequest } from "./commands";
import { Expose } from "class-transformer";
import { TimyAIResponse } from "./responses";

export interface DeviceInfo {
    modelName: string;
    usedUsers: number;
    usedFace: number;
    usedLogs: number;
    time: string;
    firmware: string;
    macAddress: string;
}

export interface TerminalConnectedDetails {
    serialNumber: string;
    cpuSerialNumber: string;
    deviceInfo: DeviceInfo;
    customerId: number;
    customerName: string;
    ipAddress: string;
}

export interface TimyTerminal {
    serialNumber: string;
    cpuSerialNumber: string;
    deviceInfo: DeviceInfo;
} 

export type TerminalToServerCommand = 
    | TimyAIRegisterRequest 
    | TimyAISendLogRequest 
    | TimyAISendUserRequest;

    export type ServerToTerminalCommand = 
    | TimyAIGetAllLogRequest
    | TimyAIContinueAllLogRequest
    | TimyAISetUserInfoRequest
    | TimyAIGetUserListRequest;


export class TimyAIGetAllLogRecord {
    @Expose({ name: 'enrollid' })
    enrollmentId!: number;
    @Expose({ name: 'name' })
    name?: string;
    @Expose({ name: 'time' })
    time!: string;
    @Expose({ name: 'mode' })
    mode!: number;
    @Expose({ name: 'inout' })
    inOut!: number;
    @Expose({ name: 'event' })
    event!: number;
}
        
export type KnownTimyAIMessageInstance = TerminalToServerCommand | ServerToTerminalCommand | TimyAIResponse;

export type TimyAIMessageClass = new (...args: unknown[]) => KnownTimyAIMessageInstance;

export type PossibleTimyAIMessage = KnownTimyAIMessageInstance | Record<string, unknown>;

export type KnownTimyAIServerCommand = ServerToTerminalCommand; 