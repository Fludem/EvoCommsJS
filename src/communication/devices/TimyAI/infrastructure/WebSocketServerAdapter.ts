import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { IMessageParser } from '../core/IMessageParser';
import { IMessageRouter } from '../core/IMessageRouter';
import { ITerminalConnectionManager } from '../core/ITerminalConnectionManager';
import { createLogger } from '../../../../utils/logger';

export class WebSocketServerAdapter extends EventEmitter {
  private wss: WebSocketServer;
  private readonly logger = createLogger('WebSocketServer');
  
  constructor(
    private readonly port: number,
    private readonly messageParser: IMessageParser,
    private readonly messageRouter: IMessageRouter,
    private readonly connectionManager: ITerminalConnectionManager
  ) {
    super();
    
    this.wss = new WebSocketServer({ port });
    this._setupServer();
  }

  private _setupServer(): void {
    // Server events
    this.wss.on('listening', () => {
      this.logger.info({ port: this.port }, 'WebSocket server listening');
      this.emit('listening', this.port);
    });

    this.wss.on('connection', (ws: WebSocket) => {
      this._handleNewConnection(ws);
    });

    this.wss.on('error', (error: Error) => {
      this.logger.error({ err: error }, 'WebSocket server error');
      this.emit('error', error);
    });
  }

  private _handleNewConnection(ws: WebSocket): void {
    this.logger.info('New terminal connection established');
    
    // Connection events
    ws.on('message', (data: Buffer) => {
      this._handleMessage(ws, data);
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this._handleConnectionClose(ws, code, reason);
    });

    ws.on('error', (error: Error) => {
      this._handleConnectionError(ws, error);
    });
  }

  private _handleMessage(ws: WebSocket, data: Buffer): void {
    try {
      const { message, identifier, isRequest } = this.messageParser.parseMessage(data);
      
      if (!identifier) {
        this.logger.warn({ message }, 'Received message without a valid identifier');
        return;
      }
      
      this.logger.debug({ 
        identifier, 
        isRequest, 
        messageType: isRequest ? 'command' : 'response' 
      }, 'Processing message');
      
      this.messageRouter.routeMessage(ws, message, identifier, isRequest);
    } catch (error) {
      this.logger.error({ err: error }, 'Error processing incoming message');
    }
  }

  private _handleConnectionClose(ws: WebSocket, code: number, reason: Buffer): void {
    this.logger.info({ 
      code, 
      reason: reason.toString() 
    }, 'Connection closed');
    
    this.connectionManager.removeConnection(ws);
  }

  private _handleConnectionError(ws: WebSocket, error: Error): void {
    this.logger.error({ err: error }, 'WebSocket connection error');
    
    // Ensure the socket is terminated if not already closed
    if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
      ws.terminate();
    }
    
    this.connectionManager.removeConnection(ws);
  }

  /**
   * Start the WebSocket server (in this case it's already started on construction)
   */
  start(): void {
    this.logger.debug('WebSocket server already started on instantiation');
  }

  /**
   * Stop the WebSocket server
   */
  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.info('Stopping WebSocket server');
      this.wss.close((err) => {
        if (err) {
          this.logger.error({ err }, 'Error closing WebSocket server');
          reject(err);
        } else {
          this.logger.info('WebSocket server stopped successfully');
          resolve();
        }
      });
    });
  }
} 