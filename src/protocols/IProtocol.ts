export interface IProtocol {
  name: string;
  version: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  isConnected(): boolean;
  send(data: any): Promise<void>;
  onData(callback: (data: any) => void): void;
  onError(callback: (error: Error) => void): void;
  onConnect(callback: () => void): void;
  onDisconnect(callback: () => void): void;
}
