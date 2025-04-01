import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { IMessageRouter } from '@/comms/TimyAI/application/interfaces/IMessageRouter';
import { ITimyAIMessageHandler } from '@/comms/TimyAI/application/interfaces/ITimyAIMessageHandler';
import { PossibleTimyAIMessage } from '@/comms/TimyAI/types/shared';
import { ITerminalConnectionManager } from '@/comms/TimyAI/application/interfaces/ITerminalConnectionManager';

/**
 * Routes messages to the appropriate handler
 */
export class MessageRouter implements IMessageRouter {
  private requestHandlers: Map<string, ITimyAIMessageHandler>;
  private responseHandlers: Map<string, ITimyAIMessageHandler>;
  
  /**
   * Constructor
   * @param eventEmitter - The event emitter for the protocol
   * @param connectionManager - The terminal connection manager
   * @param requestHandlers - The request handlers
   * @param responseHandlers - The response handlers
   */
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly connectionManager: ITerminalConnectionManager,
    requestHandlers: Map<string, ITimyAIMessageHandler>,
    responseHandlers: Map<string, ITimyAIMessageHandler>
  ) {
    this.requestHandlers = requestHandlers;
    this.responseHandlers = responseHandlers;
  }

  /**
   * Route a message to the appropriate handler
   * @param ws - The WebSocket connection
   * @param message - The incoming message
   * @param identifier - The identifier of the message
   * @param isRequest - Whether the message is a request
   */
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