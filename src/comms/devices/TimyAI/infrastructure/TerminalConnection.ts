import { WebSocket } from 'ws';
import { instanceToPlain } from 'class-transformer';
import { createLogger } from '../../../../utils/logger';
import { ServerToTerminalCommand } from '../types/shared';
import { ITerminalConnection } from '../application/interfaces/ITerminalConnection';

export class TerminalConnection implements ITerminalConnection {
  private readonly logger = createLogger('TerminalConnection');
  
  constructor(
    private readonly serialNumber: string,
    private readonly ws: WebSocket
  ) {}

  getSerialNumber(): string {
    return this.serialNumber;
  }

  getWebSocket(): WebSocket {
    return this.ws;
  }

  sendCommand(commandInstance: ServerToTerminalCommand): boolean {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.logger.warn({ serialNumber: this.serialNumber }, 'Terminal connection not open');
      return false;
    }

    try {
      const plainCommand = instanceToPlain(commandInstance);
      this.ws.send(JSON.stringify(plainCommand));
      const commandName = commandInstance.command || 'N/A';
      this.logger.info({ 
        serialNumber: this.serialNumber, 
        command: commandName 
      }, 'Command sent to terminal');
      return true;
    } catch (error) {
      this.logger.error({ 
        serialNumber: this.serialNumber, 
        command: commandInstance.command,
        err: error 
      }, 'Error sending command to terminal');
      return false;
    }
  }

  disconnect(code = 1000, reason = 'Normal closure'): void {
    if (this.ws.readyState !== WebSocket.CLOSED && this.ws.readyState !== WebSocket.CLOSING) {
      this.logger.info({ 
        serialNumber: this.serialNumber, 
        code, 
        reason 
      }, 'Disconnecting terminal');
      this.ws.close(code, reason);
    }
  }
} 