import { Expose, Type } from "class-transformer";
import { TimyAIGetAllLogRecord } from "./shared";


export class TimyAIBaseResponse {
    @Expose({ name: 'ret' })
    responseTo!: string;

    @Expose({ name: 'result' })
    commandSuccessful!: boolean;

    @Expose({ name: 'reason' })
    errorMessage?: string | number;
}

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



export type TimyAIResponse = 
    | TimyAIRegisterResponse
    | TimyAISendLogResponse
    | TimyAISendUserResponse
    | TimyAIGetAllLogResponse;