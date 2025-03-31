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
        
// Union of all known message class instances
export type KnownTimyAIMessageInstance = TerminalToServerCommand | ServerToTerminalCommand | TimyAIResponse;

// Type for a constructor that creates one of our known message instances
export type TimyAIMessageClass = new (...args: unknown[]) => KnownTimyAIMessageInstance;

// For message parsing
export type PossibleTimyAIMessage = KnownTimyAIMessageInstance | Record<string, unknown>;

// Legacy alias to maintain compatibility during refactoring
// Remove once all code has been updated to use ServerToTerminalCommand
export type KnownTimyAIServerCommand = ServerToTerminalCommand; 