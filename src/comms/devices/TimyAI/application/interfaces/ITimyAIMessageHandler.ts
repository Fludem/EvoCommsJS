import { WebSocket } from 'ws';
import { EventEmitter } from 'events';

export interface ITimyAIMessageHandler {
    handle(ws: WebSocket, message: any, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void;
} 
