import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { createLogger } from '../../../../utils/logger';
import { IMessageParser } from '../application/interfaces/IMessageParser';
import { IMessageRouter } from '../application/interfaces/IMessageRouter';
import { ITerminalConnectionManager } from '../application/interfaces/ITerminalConnectionManager';

/**
 * WebSocket server adapter
 */
export class WebSocketServerAdapter extends EventEmitter {
  private wss?: WebSocketServer;
  private readonly logger = createLogger('WebSocketServer');
  
  /**
   * Constructor
   * @param port - The port to listen on
   * @param messageParser - The message parser
   * @param messageRouter - The message router
   * @param connectionManager - The terminal connection manager
   */
  constructor(
    private readonly port: number,
    private readonly messageParser: IMessageParser,
    private readonly messageRouter: IMessageRouter,
    private readonly connectionManager: ITerminalConnectionManager
  ) {
    super();
    
    this.logger.debug({ port }, 'Initializing WebSocket server');
  }

  /**
   * Setup the WebSocket server
   */
  private _setupServer(): void {
    this.wss = new WebSocketServer({ port: this.port });
    
    this.wss.on('listening', () => {
      this.logger.info({ port: this.port }, 'WebSocket server listening');
      this.emit('listening', this.port);
    });

    this.wss.on('connection', (ws: WebSocket) => {
      this._handleNewConnection(ws);
    });

    this.wss.on('error', (error: Error) => {
      this.logger.error({ err: error, port: this.port }, 'WebSocket server error');
      this.emit('error', error);
    });
  }

  /**
   * Handles a new terminal connection and adds event listeners
   * @param ws - The WebSocket connection
   */
  private _handleNewConnection(ws: WebSocket): void {
    this.logger.info('New terminal connection established');
    
    // Connection events
    ws.on('message', (data: Buffer) => {
      this._handleMessage(ws, data);
    });

    ws.on('ping', (data: Buffer) => {
      this.logger.debug({ data }, 'Ping received');
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this._handleConnectionClose(ws, code, reason);
    });

    ws.on('error', (error: Error) => {
      this._handleConnectionError(ws, error);
    });
  }

  /**
   * Handle a message event
   * @param ws - The WebSocket connection
   * @param data - The message data
   */
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

  /**
   * Handle a connection close event
   * @param ws - The WebSocket connection
   * @param code - The code for the close event
   * @param reason - The reason for the close event
   */
  private _handleConnectionClose(ws: WebSocket, code: number, reason: Buffer): void {
    this.logger.info({ 
      code, 
      reason: reason.toString() 
    }, 'Connection closed');
    
    this.connectionManager.removeConnection(ws);
  }

  /**
   * Handle a connection error event
   * @param ws - The WebSocket connection
   * @param error - The error that occurred
   */
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
    this._setupServer();
  }

  /**
   * Stop the WebSocket server
   */
  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.info('Stopping WebSocket server');
      this.wss?.close((err) => {
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