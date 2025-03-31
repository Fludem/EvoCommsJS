import { DeviceInfo } from '@/types/terminal';
import { Expose, Type } from 'class-transformer';

// --- Base Types ---

// Base class for terminal-to-server messages (commands)
export class TimyAITerminalCommandBase {
    @Expose({ name: 'cmd' })
    command!: string;
}

// Base class for server-to-terminal messages (commands)
export class TimyAIServerCommandBase {
    @Expose({ name: 'cmd' })
    command!: string;
}

// Base class for response messages
export class TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo!: string;

    @Expose({ name: 'result' })
    commandSuccessful!: boolean;

    @Expose({ name: 'reason' })
    errorMessage?: string | number;
}

// --- Terminal -> Server Command Types ---

export class TimyAIRegisterRequest extends TimyAITerminalCommandBase {
    readonly command = 'reg' as const;
    @Expose({ name: 'sn' })
    serialNumber!: string;
    @Expose({ name: 'cpusn' })
    cpuSerialNumber!: string;
    @Expose({ name: 'devinfo' })
    deviceInfo!: DeviceInfo;
}

export class TimyAILogRecord {
    @Expose({ name: 'enrollid' })
    enrollmentId!: number;
    @Expose({ name: 'time' })
    time!: string;
    @Expose({ name: 'mode' })
    mode!: number;
    @Expose({ name: 'inout' })
    inOut!: number;
    @Expose({ name: 'event' })
    event!: number;
    @Expose({ name: 'temp' })
    temperature?: number;
    @Expose({ name: 'verifymode' })
    verifyMode?: number;
    @Expose({ name: 'image' })
    image?: string;
}

export class TimyAISendLogRequest extends TimyAITerminalCommandBase {
    readonly command = 'sendlog' as const;
    @Expose({ name: 'sn' })
    serialNumber!: string;
    @Expose({ name: 'count' })
    count!: number;
    @Expose({ name: 'logindex' })
    logIndex!: number;
    @Expose({ name: 'record' })
    @Type(() => TimyAILogRecord)
    records!: TimyAILogRecord[];
}

export class TimyAISendUserRequest extends TimyAITerminalCommandBase {
    readonly command = 'senduser' as const;
    @Expose({ name: 'enrollid' })
    enrollmentId!: number;
    @Expose({ name: 'name' })
    name!: string;
    @Expose({ name: 'backupnum' })
    backupNumber!: number;
    @Expose({ name: 'admin' })
    admin!: number;
    @Expose({ name: 'record' })
    record!: string | number;
}


// Union type for all Terminal -> Server commands
export type TerminalToServerCommand = 
    | TimyAIRegisterRequest 
    | TimyAISendLogRequest 
    | TimyAISendUserRequest;

// --- Server -> Terminal Command Types ---

export class TimyAIGetAllLogRequest extends TimyAIServerCommandBase {
    readonly command = 'getalllog' as const;
    @Expose({ name: 'stn' })
    startTransmission!: boolean;
    @Expose({ name: 'from' })
    fromDate?: string;
    @Expose({ name: 'to' })
    toDate?: string;
}

export class TimyAIContinueAllLogRequest extends TimyAIServerCommandBase {
    readonly command = 'getalllog' as const;
    @Expose({ name: 'stn' })
    readonly startTransmission: boolean = false;
}

export class TimyAISetUserInfoRequest extends TimyAIServerCommandBase {
    readonly command = 'setuserinfo' as const;
    @Expose({ name: 'enrollid' })
    enrollmentId!: number;
    @Expose({ name: 'name' })
    name!: string;
    @Expose({ name: 'backupnum' })
    backupNumber!: number;
    @Expose({ name: 'admin' })
    admin!: number;
    @Expose({ name: 'record' })
    record!: string | number; 
}

export class TimyAIGetUserListRequest extends TimyAIServerCommandBase {
    readonly command = 'getuserlist' as const;
    @Expose({ name: 'all' })
    all!: boolean;
}

// Union type for all Server -> Terminal commands (used in sendCommand)
export type ServerToTerminalCommand = 
    | TimyAIGetAllLogRequest
    | TimyAIContinueAllLogRequest
    | TimyAISetUserInfoRequest
    | TimyAIGetUserListRequest;

// --- Terminal -> Server Response Types ---

export class TimyAIRegisterResponse extends TimyAIBaseResponse {
    readonly responseTo = 'reg' as const;
    @Expose({ name: 'cloudtime' })
    cloudTime!: string;
    @Expose({ name: 'nosenduser' })
    syncNewUsers!: boolean;
}

export class TimyAISendLogResponse extends TimyAIBaseResponse {
    readonly responseTo = 'sendlog' as const;
    @Expose({ name: 'count' })
    count?: number;
    @Expose({ name: 'logindex' })
    logIndex?: number;
    @Expose({ name: 'cloudtime' })
    cloudTime?: string;
    @Expose({ name: 'access' })
    access?: number;
    @Expose({ name: 'message' })
    message?: string;
}

export class TimyAISendUserResponse extends TimyAIBaseResponse {
    readonly responseTo = 'senduser' as const;
    @Expose({ name: 'cloudtime' })
    cloudTime?: string;
}

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

export class TimyAIGetAllLogResponse extends TimyAIBaseResponse {
    readonly responseTo = 'getalllog' as const;
    @Expose({ name: 'sn' })
    serialNumber!: string;
    @Expose({ name: 'count' })
    count!: number;
    @Expose({ name: 'from' })
    from!: number;
    @Expose({ name: 'to' })
    to!: number;
    @Expose({ name: 'record' })
    @Type(() => TimyAIGetAllLogRecord)
    records!: TimyAIGetAllLogRecord[];
}

// Union type for all known responses
export type TimyAIResponse = 
    | TimyAIRegisterResponse
    | TimyAISendLogResponse
    | TimyAISendUserResponse
    | TimyAIGetAllLogResponse;

// Union of all known message class instances
export type KnownTimyAIMessageInstance = TerminalToServerCommand | ServerToTerminalCommand | TimyAIResponse;

// Type for a constructor that creates one of our known message instances
export type TimyAIMessageClass = new (...args: unknown[]) => KnownTimyAIMessageInstance;

// For message parsing
export type PossibleTimyAIMessage = KnownTimyAIMessageInstance | Record<string, unknown>;

// Legacy alias to maintain compatibility during refactoring
// Remove once all code has been updated to use ServerToTerminalCommand
export type KnownTimyAIServerCommand = ServerToTerminalCommand; 