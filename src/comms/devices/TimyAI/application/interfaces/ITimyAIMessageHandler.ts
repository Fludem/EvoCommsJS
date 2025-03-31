import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { PossibleTimyAIMessage } from '../../types/shared';

export interface ITimyAIMessageHandler {
    /**
     * Handle an incoming message
     * @param ws - The WebSocket connection
     * @param message - The incoming message
     * @param protocolEmitter - The event emitter for the protocol
     * @param connectedTerminals - A map of connected terminal serial numbers to their WebSocket connections
     */
    handle(ws: WebSocket, message: PossibleTimyAIMessage, protocolEmitter: EventEmitter, connectedTerminals: Map<string, WebSocket>): void;
} 
