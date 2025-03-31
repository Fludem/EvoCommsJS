import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { Terminal } from '../../../../types/terminal';

export interface ITimyAIMessageHandler {
    handle(ws: WebSocket, message: any, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void;
} 