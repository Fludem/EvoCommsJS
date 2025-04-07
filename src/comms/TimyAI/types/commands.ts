import { Expose, Type } from "class-transformer";
import { DeviceInfo, TimyAIMessage } from "./shared";

export class TimyAITerminalCommandBase extends TimyAIMessage {
    @Expose({ name: 'cmd' })
    command!: string;
}
export class TimyAIServerCommandBase extends TimyAIMessage {
    @Expose({ name: 'cmd' })
    command!: string;
}

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


export class TimyAIGetAllLogRequest extends TimyAIServerCommandBase {
    readonly command = 'getalllog' as const;
    @Expose({ name: 'stn' })
    startTransmission!: boolean;
    @Expose({ name: 'from' })
    fromDate?: string;
    @Expose({ name: 'to' })
    toDate?: string;
}

