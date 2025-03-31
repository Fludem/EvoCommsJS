import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { ITerminalConnectionManager } from '@/comms/devices/TimyAI/application/interfaces/ITerminalConnectionManager';
import { ITerminalConnection } from '@/comms/devices/TimyAI/application/interfaces/ITerminalConnection';
import { TerminalConnection } from './TerminalConnection';

export class TerminalConnectionManager extends EventEmitter implements ITerminalConnectionManager {
  private connections: Map<string, ITerminalConnection> = new Map();

  constructor() {
    super();
  }

  registerConnection(serialNumber: string, ws: WebSocket): void {
    const connection = new TerminalConnection(serialNumber, ws);
    this.connections.set(serialNumber, connection);
    this.emit('terminalConnected', serialNumber);
    console.log(`Terminal ${serialNumber} registered`);
  }

  getConnection(serialNumber: string): ITerminalConnection | undefined {
    return this.connections.get(serialNumber);
  }

  getConnectedTerminals(): string[] {
    return Array.from(this.connections.keys());
  }

  removeConnection(ws: WebSocket): string | null {
    let disconnectedSN: string | null = null;
    
    for (const [serialNumber, connection] of this.connections.entries()) {
      if (connection.getWebSocket() === ws) {
        this.connections.delete(serialNumber);
        disconnectedSN = serialNumber;
        this.emit('terminalDisconnected', serialNumber);
        console.log(`Terminal ${serialNumber} disconnected.`);
        break;
      }
    }
    
    return disconnectedSN;
  }
} 