import { Expose, Type } from 'class-transformer';
import { DeviceInfo } from '../../../types/terminal';

// --- Base Classes for Common Fields ---
// We can create base classes if many requests/responses share fields

class TimyAIBaseRequest {
    @Expose({ name: 'cmd' })
    command!: string; // Use definite assignment assertion or initialize in constructor
}

class TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo!: string;

    @Expose({ name: 'result' })
    commandSuccessful!: boolean;

    @Expose({ name: 'reason' })
    errorMessage?: string | number;
}

// --- Request Payloads ---

export class TimyAIRegisterRequest extends TimyAIBaseRequest {
    @Expose({ name: 'cmd' }) // Override if needed, or rely on base class
    command: 'reg' = 'reg';

    @Expose({ name: 'sn' })
    serialNumber!: string;

    @Expose({ name: 'cpusn' })
    cpuSerialNumber!: string;

    @Expose({ name: 'devinfo' })
    deviceInfo!: any; // Keep as any for flexibility, map separately
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
    temperature?: number; // Optional

    @Expose({ name: 'verifymode' })
    verifyMode?: number; // Optional

    @Expose({ name: 'image' })
    image?: string; // Optional
}

export class TimyAISendLogRequest extends TimyAIBaseRequest {
    @Expose({ name: 'cmd' })
    command: 'sendlog' = 'sendlog';

    @Expose({ name: 'sn' })
    serialNumber!: string;

    @Expose({ name: 'count' })
    count!: number;

    @Expose({ name: 'logindex' })
    logIndex!: number;

    @Expose({ name: 'record' })
    @Type(() => TimyAILogRecord) // Important for nested objects/arrays
    records!: TimyAILogRecord[];
}

export class TimyAISendUserRequest extends TimyAIBaseRequest {
    @Expose({ name: 'cmd' })
    command: 'senduser' = 'senduser';

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

export class TimyAISendQRCodeRequest extends TimyAIBaseRequest {
    @Expose({ name: 'cmd' })
    command: 'sendqrcode' = 'sendqrcode';

    @Expose({ name: 'sn' })
    serialNumber!: string;

    @Expose({ name: 'record' })
    record!: string;
}

// Server -> Terminal request
export class TimyAIGetAllLogRequest extends TimyAIBaseRequest {
    @Expose({ name: 'cmd' })
    command: 'getalllog' = 'getalllog';

    @Expose({ name: 'stn' })
    startTransmission!: boolean; // Mapped from stn

    @Expose({ name: 'from' })
    fromDate?: string; // Optional

    @Expose({ name: 'to' })
    toDate?: string; // Optional
}

// --- Response Payloads ---

export class TimyAIRegisterResponse extends TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo: 'reg' = 'reg';

    @Expose({ name: 'cloudtime' })
    cloudTime!: string;

    @Expose({ name: 'nosenduser' })
    syncNewUsers!: boolean;
}

export class TimyAISendLogResponse extends TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo: 'sendlog' = 'sendlog';

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
    @Expose({ name: 'ret' })
    responseTo: 'senduser' = 'senduser';

    @Expose({ name: 'cloudtime' })
    cloudTime?: string;
}

export class TimyAISendQRCodeResponse extends TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo: 'sendqrcode' = 'sendqrcode';

    @Expose({ name: 'access' })
    access?: number;

    @Expose({ name: 'enrollid' })
    enrollmentId?: number;

    @Expose({ name: 'username' })
    username?: string;

    @Expose({ name: 'message' })
    message?: string;
}

// Type for the nested record in the GetAllLog response
export class TimyAIGetAllLogRecord {
    @Expose({ name: 'enrollid' })
    enrollmentId!: number;

    @Expose({ name: 'name' })
    name?: string; // Name might not always be present depending on device config/firmware

    @Expose({ name: 'time' })
    time!: string;

    @Expose({ name: 'mode' })
    mode!: number;

    @Expose({ name: 'inout' })
    inOut!: number;

    @Expose({ name: 'event' })
    event!: number;
}

// Terminal -> Server response to a GetAllLog request
export class TimyAIGetAllLogResponse extends TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo: 'getalllog' = 'getalllog';

    @Expose({ name: 'sn' })
    serialNumber!: string;

    // 'result' is inherited from TimyAIBaseResponse

    @Expose({ name: 'count' })
    count!: number; // Total number of logs matching criteria

    @Expose({ name: 'from' })
    from!: number; // Starting index of this batch (0-based)

    @Expose({ name: 'to' })
    to!: number; // Ending index of this batch (0-based)

    @Expose({ name: 'record' })
    @Type(() => TimyAIGetAllLogRecord)
    records!: TimyAIGetAllLogRecord[];
} 