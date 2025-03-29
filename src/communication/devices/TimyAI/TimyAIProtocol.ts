import { WebSocketServer, WebSocket } from 'ws';
import { Terminal, DeviceInfo } from '../../../types/terminal';
import { EventEmitter } from 'events';

export class TimyAIProtocol extends EventEmitter {
    private wss: WebSocketServer;
    private connectedTerminals: Map<string, WebSocket> = new Map();
    private readonly PORT = 7788;

    constructor() {
        super();
        this.wss = new WebSocketServer({ port: this.PORT });
        this.setupWebSocketServer();
    }  

    private setupWebSocketServer(): void {
        this.wss.on('listening', () => {
            console.log(`TimyAI WebSocket server listening on port ${this.PORT}`);
        });

        this.wss.on('connection', (ws: WebSocket) => {
            console.log('New terminal connection established');
            
            ws.on('message', (data: Buffer) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('close', () => {
                this.handleDisconnect(ws);
            });

            ws.on('error', (error: Error) => {
                console.error('WebSocket error:', error);
                this.handleDisconnect(ws);
            });
        });
    }

    private handleMessage(ws: WebSocket, message: any): void {
        switch (message.cmd) {
            case 'reg':
                this.handleRegistration(ws, message);
                break;
            case 'sendlog':
                this.handleClockingData(ws, message);
                break;
            case 'senduser':
                this.handleUserData(ws, message);
                break;
            case 'sendqrcode':
                this.handleQRCode(ws, message);
                break;
            default:
                console.warn('Unhandled message type:', message.cmd);
        }
    }

    private extractDeviceInfo(devinfo: any): DeviceInfo {
        return {
            modelName: devinfo.modelname || '',
            usedUsers: devinfo.useduser || 0,
            usedFace: devinfo.usedface || 0,
            usedLogs: devinfo.usedlog || 0,
            time: devinfo.time || new Date().toISOString(),
            firmware: devinfo.firmware || '',
            macAddress: devinfo.mac || ''
        };
    }

    private handleRegistration(ws: WebSocket, data: any): void {
        const deviceInfo = this.extractDeviceInfo(data.devinfo);
        
        const terminal: Terminal = {
            serialNumber: data.sn,
            cpuSerialNumber: data.cpusn,
            deviceInfo
        };

        this.connectedTerminals.set(terminal.serialNumber, ws);
        
        // Send registration response
        const response = {
            ret: 'reg',
            result: true,
            cloudtime: new Date().toISOString().replace('T', ' ').split('.')[0],
            nosenduser: true
        };
        
        ws.send(JSON.stringify(response));
        this.emit('terminalRegistered', terminal);
    }

    private handleClockingData(ws: WebSocket, data: any): void {
        // Process clocking data and emit event
        this.emit('clockingReceived', {
            terminalSN: data.sn,
            clockings: data.record,
            logIndex: data.logindex
        });

        // Send response
        const response = {
            ret: 'sendlog',
            result: true,
            count: data.count,
            logindex: data.logindex,
            cloudtime: new Date().toISOString().replace('T', ' ').split('.')[0]
        };
        
        ws.send(JSON.stringify(response));
    }

    private handleUserData(ws: WebSocket, data: any): void {
        // Process user data and emit event
        this.emit('userDataReceived', {
            enrollId: data.enrollid,
            name: data.name,
            backupNum: data.backupnum,
            admin: data.admin,
            record: data.record
        });

        // Send response
        const response = {
            ret: 'senduser',
            result: true,
            cloudtime: new Date().toISOString().replace('T', ' ').split('.')[0]
        };
        
        ws.send(JSON.stringify(response));
    }

    private handleQRCode(ws: WebSocket, data: any): void {
        // Process QR code and emit event
        this.emit('qrCodeReceived', {
            terminalSN: data.sn,
            code: data.record
        });

        // Send response
        const response = {
            ret: 'sendqrcode',
            result: true,
            access: 1,
            enrollid: 0,
            username: '',
            message: 'QR Code received'
        };
        
        ws.send(JSON.stringify(response));
    }

    private handleDisconnect(ws: WebSocket): void {
        // Find and remove the disconnected terminal
        for (const [serialNumber, socket] of this.connectedTerminals.entries()) {
            if (socket === ws) {
                this.connectedTerminals.delete(serialNumber);
                this.emit('terminalDisconnected', serialNumber);
                console.log(`Terminal ${serialNumber} disconnected`);
                break;
            }
        }
    }

    public start(): void {
        // The WebSocket server is already started in the constructor
        console.log('TimyAI protocol handler started');
    }

    public stop(): void {
        this.wss.close(() => {
            console.log('TimyAI WebSocket server stopped');
        });
    }

    public getConnectedTerminals(): string[] {
        return Array.from(this.connectedTerminals.keys());
    }
} 