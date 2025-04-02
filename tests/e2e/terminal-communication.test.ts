import { jest } from '@jest/globals';
import { Server } from '../../src/server';
import WebSocket from 'ws';
import { container } from 'tsyringe';
import { TerminalResolutionService } from '../../src/services/terminal-resolution.service';

// Mock the TerminalResolutionService
jest.mock('../../src/services/terminal-resolution.service');

// Mock API endpoints
jest.mock('node:fetch', () => jest.fn());

describe('Terminal Communication E2E', () => {
  let server: Server;
  let wsClient: WebSocket;
  const PORT = 3001; // Use a different port for testing
  const WS_URL = `ws://localhost:${PORT}`;
  
  // Set up a mock for the TerminalResolutionService
  const mockTerminalResolutionService = {
    resolveTerminal: jest.fn(),
  };

  beforeAll(async () => {
    // Register mock services
    container.registerInstance(TerminalResolutionService, mockTerminalResolutionService as any);
    
    // Start the server
    server = new Server(PORT);
    await server.start();
  });

  afterAll(async () => {
    // Close client connection if open
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.close();
    }
    
    // Shutdown the server
    if (server) {
      // @ts-expect-error - accessing private property for testing
      await new Promise<void>((resolve) => server['server'].close(() => resolve()));
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTerminalResolutionService.resolveTerminal.mockResolvedValue(BigInt(1));
  });

  describe('WebSocket Connection', () => {
    it('should establish connection with a terminal', async () => {
      // Create a promise that resolves when the connection is established
      const connectionPromise = new Promise<void>((resolve, reject) => {
        wsClient = new WebSocket(WS_URL);
        
        wsClient.on('open', () => {
          resolve();
        });
        
        wsClient.on('error', (error) => {
          reject(error);
        });
      });

      // Wait for the connection to be established
      await connectionPromise;
      
      // Verify the connection is established
      expect(wsClient.readyState).toBe(WebSocket.OPEN);
    });

    it('should handle terminal identification message', async () => {
      // Create a promise that resolves when we get a response
      const responsePromise = new Promise<string>((resolve) => {
        wsClient = new WebSocket(WS_URL);
        
        wsClient.on('open', () => {
          // Send identification message
          const identificationMessage = JSON.stringify({
            type: 'IDENTIFY',
            data: {
              serialNumber: 'TEST123',
              model: 'TestModel',
              firmwareVersion: '1.0.0'
            }
          });
          wsClient.send(identificationMessage);
        });
        
        wsClient.on('message', (data) => {
          resolve(data.toString());
        });
      });

      // Configure mock response
      mockTerminalResolutionService.resolveTerminal.mockResolvedValueOnce(BigInt(12345));

      // Wait for the response
      const response = await responsePromise;
      const parsedResponse = JSON.parse(response);
      
      // Verify the terminal resolution service was called
      expect(mockTerminalResolutionService.resolveTerminal).toHaveBeenCalledWith('TEST123');
      
      // Verify we get an acknowledgment response
      expect(parsedResponse).toHaveProperty('type', 'IDENTIFY_ACK');
      expect(parsedResponse).toHaveProperty('status', 'success');
    });
  });
}); 