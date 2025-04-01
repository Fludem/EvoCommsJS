import { TimyAIServer } from './comms/TimyAI/TimyAIServer';
import { TimyTerminal } from './comms/TimyAI/types/shared';

export class Server {
  private protocolServers: Map<string, any> = new Map();
  private timyServer: TimyAIServer;

  constructor() {
    this.timyServer = new TimyAIServer();
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for the TimyAI server
   * @todo add top level handlers for none device specific logic 
   */
  private setupEventHandlers(): void {
    this.timyServer.on('terminalRegistered', (terminal: TimyTerminal) => {
      console.log('Main Server: Terminal registered:', terminal.serialNumber);
      // Top level event for when a terminal connects and sends reg command
    });

    this.timyServer.on('clockingReceived', (data: any) => {
      console.log('Main Server: Clocking received from terminal:', data.terminalSN);
      // top level event for when a terminal sends a clocking
    });

    this.timyServer.on('userDataReceived', (data: any) => {
      console.log('Main Server: User data received:', data.enrollId);
      // top level event for when a terminal sends user data
    });

    this.timyServer.on('terminalDisconnected', (serialNumber: string) => {
      console.log('Main Server: Terminal disconnected:', serialNumber);
      // top level event for when a terminal disconnects
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
