export interface DeviceInfo {
    modelName: string;
    usedUsers: number;
    usedFace: number;
    usedLogs: number;
    time: string;
    firmware: string;
    macAddress: string;
}

export interface Terminal {
    serialNumber: string;
    cpuSerialNumber: string;
    deviceInfo: DeviceInfo;
} 