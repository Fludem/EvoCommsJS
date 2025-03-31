import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { IMessageRouter } from '../core/IMessageRouter';
import { ITerminalConnectionManager } from '../core/ITerminalConnectionManager';
import { ITimyAIMessageHandler } from '../handlers/ITimyAIMessageHandler';
import { PossibleTimyAIMessage } from '../types';

export class MessageRouter implements IMessageRouter {
  private requestHandlers: Map<string, ITimyAIMessageHandler>;
  private responseHandlers: Map<string, ITimyAIMessageHandler>;
  
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly connectionManager: ITerminalConnectionManager,
    requestHandlers: Map<string, ITimyAIMessageHandler>,
    responseHandlers: Map<string, ITimyAIMessageHandler>
  ) {
    this.requestHandlers = requestHandlers;
    this.responseHandlers = responseHandlers;
  }

  routeMessage(
    ws: WebSocket, 
    message: PossibleTimyAIMessage, 
    identifier: string, 
    isRequest: boolean
  ): void {
    const handlerMap = isRequest ? this.requestHandlers : this.responseHandlers;
    const handler = handlerMap.get(identifier);

    if (!handler) {
      console.warn(`No handler found for ${isRequest ? 'command' : 'response'}: ${identifier}`);
      return;
    }

    try {
      const terminals = new Map<string, WebSocket>();
      
      this.connectionManager.getConnectedTerminals().forEach(serialNumber => {
        const connection = this.connectionManager.getConnection(serialNumber);
        if (connection) {
          terminals.set(serialNumber, connection.getWebSocket());
        }
      });
      
      handler.handle(ws, message, this.eventEmitter, terminals);
    } catch (error) {
      console.error(`Error executing ${isRequest ? 'request' : 'response'} handler for ${identifier}:`, error);
    }
  }
} 