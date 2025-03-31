import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { ITimyAIMessageHandler } from './handlers/ITimyAIMessageHandler';
import { RegistrationHandler } from './handlers/RegistrationHandler';
import { ClockingDataHandler } from './handlers/ClockingDataHandler';
import { UserDataHandler } from './handlers/UserDataHandler';
import { QRCodeHandler } from './handlers/QRCodeHandler';
import { GetAllLogResponseHandler } from './handlers/GetAllLogResponseHandler';
import { TimyAIRegisterRequest, TimyAISendLogRequest, TimyAISendUserRequest, TimyAISendQRCodeRequest, TimyAIGetAllLogResponse } from './types';

// Renaming the class to better reflect its responsibility
export class TimyAIServer extends EventEmitter {
    private wss: WebSocketServer;
    private connectedTerminals: Map<string, WebSocket> = new Map();
    private requestHandlers!: Map<string, ITimyAIMessageHandler>;
    private responseHandlers!: Map<string, ITimyAIMessageHandler>;
    private readonly PORT = 7788;

    constructor() {
        super();
        this._initializeHandlers();
        this.wss = new WebSocketServer({ port: this.PORT });
        this._setupWebSocketServer();
    }

    // Public method to start (though server starts listening on construction)
    public start(): void {
        console.log('TimyAI server handler started (WebSocket server listens on instantiation)');
    }

    // Public method to stop the server
    public stop(): void {
        console.log('Stopping TimyAI WebSocket server...');
        this.wss.close((err) => {
            if (err) {
                console.error('Error closing WebSocket server:', err);
            } else {
                console.log('TimyAI WebSocket server stopped');
            }
        });
    }

    // Public method to get connected terminal serial numbers
    public getConnectedTerminals(): string[] {
        return Array.from(this.connectedTerminals.keys());
    }

    // Modified sendCommand to handle class instances automatically
    public sendCommand(serialNumber: string, commandInstance: any): boolean {
        const ws = this.connectedTerminals.get(serialNumber);
        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                // Convert command instance to plain object before sending
                const plainCommand = instanceToPlain(commandInstance);
                ws.send(JSON.stringify(plainCommand));
                // Use the mapped property name if available, else fallback
                const commandName = commandInstance.command || (plainCommand as any).cmd || 'N/A';
                console.log(`Sent command ${commandName} to ${serialNumber}`);
                return true;
            } catch (error) {
                console.error(`Error sending command to ${serialNumber}:`, error);
                return false;
            }
        } else {
            console.warn(`Terminal ${serialNumber} not connected or connection not open.`);
            return false;
        }
    }

    // --- Private Helper Methods ---

    private _initializeHandlers(): void {
        this.requestHandlers = new Map<string, ITimyAIMessageHandler>();
        this.requestHandlers.set('reg', new RegistrationHandler());
        this.requestHandlers.set('sendlog', new ClockingDataHandler());
        this.requestHandlers.set('senduser', new UserDataHandler());
        this.requestHandlers.set('sendqrcode', new QRCodeHandler());
        console.log('TimyAI request handlers initialized.');
        
        this.responseHandlers = new Map<string, ITimyAIMessageHandler>();
        this.responseHandlers.set('getalllog', new GetAllLogResponseHandler());
        // Add more response handlers here
        console.log('TimyAI response handlers initialized.');
    }

    // Sets up the main WebSocket server event listeners
    private _setupWebSocketServer(): void {
        this.wss.on('listening', () => {
            console.log(`TimyAI WebSocket server listening on port ${this.PORT}`);
        });

        this.wss.on('connection', (ws: WebSocket) => {
            this._handleConnection(ws);
        });

        this.wss.on('error', (error: Error) => {
            console.error('WebSocket Server Error:', error);
            // Potentially try to restart the server or handle critical failure
        });
    }

    // Handles a new incoming WebSocket connection
    private _handleConnection(ws: WebSocket): void {
        console.log('New terminal connection established');
        // Setup listeners for the specific connection
        this._setupWebSocketEventHandlers(ws);
        // Future: Could implement connection limits or initial handshake/timeout here
    }

    // Sets up event listeners for an individual WebSocket connection
    private _setupWebSocketEventHandlers(ws: WebSocket): void {
        ws.on('message', (data: Buffer) => {
            this._handleIncomingMessage(ws, data);
        });

        ws.on('close', (code: number, reason: Buffer) => {
            this._handleConnectionClose(ws, code, reason);
        });

        ws.on('error', (error: Error) => {
            this._handleConnectionError(ws, error);
        });
    }

    // Updated message handling to differentiate requests (cmd) and responses (ret)
    private _handleIncomingMessage(ws: WebSocket, data: Buffer): void {
        let plainMessageObject: any;
        try {
            plainMessageObject = JSON.parse(data.toString('utf-8'));
        } catch (error) {
            console.error('Error parsing message or invalid JSON received:', error);
            return;
        }

        let identifier: string | null = null;
        let isRequest: boolean = false;
        let MessageClass: any | null = null;
        let messageToRoute: any = plainMessageObject; // Default to routing the plain object

        // Determine type and identifier
        if (plainMessageObject && typeof plainMessageObject.cmd === 'string') {
            identifier = plainMessageObject.cmd;
            isRequest = true;
        } else if (plainMessageObject && typeof plainMessageObject.ret === 'string') {
            identifier = plainMessageObject.ret;
            isRequest = false;
        }

        // Exit if we don't have a valid identifier
        if (identifier === null) {
            console.warn(`Received message without a valid 'cmd' or 'ret' property:`, plainMessageObject);
            return;
        }

        // Try to find a class mapping
        MessageClass = this._getMessageClass(identifier, isRequest);

        // If we have a class mapping, try to transform
        if (MessageClass) {
            try {
                const messageInstance = plainToInstance(MessageClass, plainMessageObject, {
                    excludeExtraneousValues: true,
                });
                messageToRoute = messageInstance; // Use the instance if successful
            } catch (transformationError) {
                console.error(`Error transforming message for ${isRequest ? 'command' : 'response'} ${identifier}. Routing plain object.`, transformationError);
                // Keep messageToRoute as plainMessageObject
            }
        } else {
            console.warn(`No class mapping for ${isRequest ? 'command' : 'response'}: ${identifier}. Routing plain object.`);
        }

        // Route whatever message we ended up with (instance or plain object)
        this._routeMessageToHandler(ws, messageToRoute, isRequest, identifier);
    }

    // Updated to accept isRequest flag
    private _getMessageClass(identifier: string, isRequest: boolean): any | null {
        if (isRequest) {
            switch (identifier) {
                case 'reg': return TimyAIRegisterRequest;
                case 'sendlog': return TimyAISendLogRequest;
                case 'senduser': return TimyAISendUserRequest;
                case 'sendqrcode': return TimyAISendQRCodeRequest;
                default: return null;
            }
        } else { // It's a response
            switch (identifier) {
                case 'getalllog': return TimyAIGetAllLogResponse;
                // Add mappings for other expected responses here
                default: return null;
            }
        }
    }

    // Updated to use appropriate handler map based on isRequest flag
    private _routeMessageToHandler(ws: WebSocket, message: any, isRequest: boolean, identifier: string): void {
        const handlerMap = isRequest ? this.requestHandlers : this.responseHandlers;
        const handler = handlerMap.get(identifier);

        if (handler) {
            try {
                // Pass the WebSocket, the message instance (or plain object), the emitter, and terminals map
                handler.handle(ws, message, this, this.connectedTerminals);
            } catch (error) {
                console.error(`Error executing ${isRequest ? 'request' : 'response'} handler for ${identifier}:`, error);
            }
        } else {
            console.warn(`No handler found for ${isRequest ? 'command' : 'response'}: ${identifier}`);
        }
    }

    // Handles the closing of a specific WebSocket connection
    private _handleConnectionClose(ws: WebSocket, code: number, reason: Buffer): void {
        let disconnectedSN: string | null = null;
        for (const [serialNumber, socket] of this.connectedTerminals.entries()) {
            if (socket === ws) {
                this.connectedTerminals.delete(serialNumber);
                disconnectedSN = serialNumber;
                break;
            }
        }
        if (disconnectedSN) {
            this.emit('terminalDisconnected', disconnectedSN);
            console.log(`Terminal ${disconnectedSN} disconnected. Code: ${code}, Reason: ${reason.toString()}`);
        } else {
            // This might happen if the connection closes before registration completes
            console.log(`Unidentified connection closed. Code: ${code}, Reason: ${reason.toString()}`);
        }
    }

    // Handles an error occurring on a specific WebSocket connection
    private _handleConnectionError(ws: WebSocket, error: Error): void {
        console.error('WebSocket connection error:', error);
        // Attempt to gracefully close and clean up the connection on error
        this._handleConnectionClose(ws, 1011, Buffer.from('Internal Server Error')); // 1011 = Internal Error
        // Ensure the socket is terminated if not already closed
        if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
            ws.terminate();
        }
    }
} 