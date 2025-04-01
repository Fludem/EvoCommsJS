import 'reflect-metadata';
import { container } from 'tsyringe';
import { EventEmitter } from 'events';
import { ITerminalConnectionManager } from '../comms/TimyAI/application/interfaces/ITerminalConnectionManager';
import { TerminalConnectionManager } from '../comms/TimyAI/infrastructure/TerminalConnectionManager';
import { IMessageParser } from '../comms/TimyAI/application/interfaces/IMessageParser';
import { MessageParser } from '../comms/TimyAI/infrastructure/messaging/MessageParser';
import { MessageRouter } from '../comms/TimyAI/infrastructure/messaging/MessageRouter';
import { WebSocketServerAdapter } from '../comms/TimyAI/infrastructure/WebSocketServerAdapter';
import { RegistrationHandler } from '../comms/TimyAI/application/handlers/RegistrationHandler';
import { ClockingDataHandler } from '../comms/TimyAI/application/handlers/ClockingDataHandler';
import { UserDataHandler } from '../comms/TimyAI/application/handlers/UserDataHandler';
import { GetAllLogResponseHandler } from '../comms/TimyAI/application/handlers/GetAllLogResponseHandler';
import { HandlerService } from '../comms/TimyAI/application/services/HandlerService';
import { TimyAIServer } from '../comms/TimyAI/TimyAIServer';

/**
 * Register all services with the DI container
 */
export function registerServices(): void {
  container.register<EventEmitter>(EventEmitter, {
    useValue: new EventEmitter()
  });
  
  container.register('port', {
    useValue: parseInt(process.env.TIMYAI_PORT || '7788', 10)
  });
  
  container.register<ITerminalConnectionManager>('ITerminalConnectionManager', {
    useClass: TerminalConnectionManager
  });
  
  container.register<IMessageParser>('IMessageParser', {
    useClass: MessageParser
  });
  container.register('RegistrationHandler', {
    useClass: RegistrationHandler
  });
  
  container.register('ClockingDataHandler', {
    useClass: ClockingDataHandler
  });
  
  container.register('UserDataHandler', {
    useClass: UserDataHandler
  });
  
  container.register('GetAllLogResponseHandler', {
    useClass: GetAllLogResponseHandler
  });
  
  container.register(HandlerService, {
    useClass: HandlerService
  });
  
  container.register(MessageRouter, {
    useClass: MessageRouter
  });
  
  container.register(WebSocketServerAdapter, {
    useClass: WebSocketServerAdapter
  });
  
  container.register(TimyAIServer, {
    useClass: TimyAIServer
  });
}

export default container; 