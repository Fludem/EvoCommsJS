import { TimyAIProtocol } from './communication/devices/TimyAI/TimyAIProtocol';
import { Terminal } from './types/terminal';

export class Server {
  private protocols: Map<string, any> = new Map();
  private timy: TimyAIProtocol;

  constructor() {
    this.timy = new TimyAIProtocol();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.timy.on('terminalRegistered', (terminal: Terminal) => {
      console.log('Terminal registered:', terminal.serialNumber);
      // Handle terminal registration
    });

    this.timy.on('clockingReceived', (data: any) => {
      console.log('Clocking received from terminal:', data.terminalSN);
      // Handle clocking data
    });

    this.timy.on('userDataReceived', (data: any) => {
      console.log('User data received:', data.enrollId);
      // Handle user data
    });

    this.timy.on('qrCodeReceived', (data: any) => {
      console.log('QR Code received from terminal:', data.terminalSN);
      // Handle QR code
    });

    this.timy.on('terminalDisconnected', (serialNumber: string) => {
      console.log('Terminal disconnected:', serialNumber);
      // Handle terminal disconnection
    });
  }

  async start(): Promise<void> {
    try {
      await this.initializeProtocols();
      await this.startListening();
    } catch (error) {
      console.error('Error starting server:', error);
      throw error;
    }
  }

  private async initializeProtocols(): Promise<void> {
    console.log('Initializing protocols...');
    this.protocols.set('TimyAI', this.timy);
  }

  private async startListening(): Promise<void> {
    console.log('Starting to listen for connections...');
    this.timy.start();
  }

  public async stop(): Promise<void> {
    console.log('Stopping server...');
    this.timy.stop();
  }
}
