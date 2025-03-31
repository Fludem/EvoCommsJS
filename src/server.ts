import { TimyAIServer } from './communication/devices/TimyAI/TimyAIServer';
import { Terminal } from './types/terminal';

export class Server {
  private protocolServers: Map<string, any> = new Map();
  private timyServer: TimyAIServer;

  constructor() {
    this.timyServer = new TimyAIServer();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.timyServer.on('terminalRegistered', (terminal: Terminal) => {
      console.log('Main Server: Terminal registered:', terminal.serialNumber);
      // Handle terminal registration (e.g., save to DB, update status)
    });

    this.timyServer.on('clockingReceived', (data: any) => {
      console.log('Main Server: Clocking received from terminal:', data.terminalSN);
      // Handle clocking data (e.g., save to DB, process attendance)
    });

    this.timyServer.on('userDataReceived', (data: any) => {
      console.log('Main Server: User data received:', data.enrollId);
      // Handle user data (e.g., update local user cache/DB)
    });

    this.timyServer.on('terminalDisconnected', (serialNumber: string) => {
      console.log('Main Server: Terminal disconnected:', serialNumber);
      // Handle terminal disconnection (e.g., update status in DB, log event)
    });
  }

  async start(): Promise<void> {
    try {
      await this.initializeServers();
      await this.startListening();
    } catch (error) {
      console.error('Error starting main server:', error);
      throw error;
    }
  }

  private async initializeServers(): Promise<void> {
    console.log('Initializing communication servers...');
    this.protocolServers.set('TimyAI', this.timyServer);
  }

  private async startListening(): Promise<void> {
    console.log('Starting communication servers...');
    this.timyServer.start();
  }

  public async stop(): Promise<void> {
    console.log('Stopping main server and communication servers...');
    this.timyServer.stop();
  }
}
