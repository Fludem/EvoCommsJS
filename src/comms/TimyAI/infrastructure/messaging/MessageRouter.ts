import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { injectable, inject } from 'tsyringe';
import { IMessageRouter } from '../../application/interfaces/IMessageRouter';
import { ITimyAIMessageHandler } from '../../application/interfaces/ITimyAIMessageHandler';
import { PossibleTimyAIMessage } from '../../types/shared';
import { ITerminalConnectionManager } from '../../application/interfaces/ITerminalConnectionManager';
import { HandlerService } from '../../application/services/HandlerService';
import { createLogger } from '../../../../utils/logger';

/**
 * Routes messages to the appropriate handler
 */
@injectable()
export class MessageRouter implements IMessageRouter {
  private readonly logger = createLogger('MessageRouter');
  private requestHandlers: Map<string, ITimyAIMessageHandler>;
  private responseHandlers: Map<string, ITimyAIMessageHandler>;
  
  /**
   * Constructor
   * @param eventEmitter - The event emitter for the protocol
   * @param connectionManager - The terminal connection manager
   * @param handlerService - The handler service
   */
  constructor(
    private readonly eventEmitter: EventEmitter,
    @inject('ITerminalConnectionManager') private readonly connectionManager: ITerminalConnectionManager,
    private readonly handlerService: HandlerService
  ) {
    this.requestHandlers = this.handlerService.getRequestHandlers();
    this.responseHandlers = this.handlerService.getResponseHandlers();
    this.logger.debug('MessageRouter initialized');
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
      this.logger.warn({ identifier, isRequest }, `No handler found for ${isRequest ? 'command' : 'response'}`);
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
      this.logger.error({ 
        err: error, 
        identifier, 
        isRequest 
      }, `Error executing ${isRequest ? 'request' : 'response'} handler`);
    }
  }
} 