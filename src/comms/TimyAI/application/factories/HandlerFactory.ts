import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import container from '../../../../di/container';

/**
 * Factory for creating message handlers
 */
export class HandlerFactory {
  /**
   * Create request handlers
   * @returns A map of request handlers
   */
  static createRequestHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('reg', container.resolve('RegistrationHandler'));
    handlers.set('sendlog', container.resolve('ClockingDataHandler'));
    handlers.set('senduser', container.resolve('UserDataHandler'));
    
    return handlers;
  }

  /**
   * Create response handlers
   * @returns A map of response handlers
   */
  static createResponseHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('getalllog', container.resolve('GetAllLogResponseHandler'));
    return handlers;
  }
} 