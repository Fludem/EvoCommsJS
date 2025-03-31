import { ITimyAIMessageHandler } from '../handlers/ITimyAIMessageHandler';
import { RegistrationHandler } from '../handlers/RegistrationHandler';
import { ClockingDataHandler } from '../handlers/ClockingDataHandler';
import { UserDataHandler } from '../handlers/UserDataHandler';
import { GetAllLogResponseHandler } from '../handlers/GetAllLogResponseHandler';

export class HandlerFactory {
  /**
   * Initialize request handlers for terminal -> server messages
   */
  static createRequestHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('reg', new RegistrationHandler());
    handlers.set('sendlog', new ClockingDataHandler());
    handlers.set('senduser', new UserDataHandler());
    
    return handlers;
  }

  /**
   * Initialize response handlers for server -> terminal responses
   */
  static createResponseHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('getalllog', new GetAllLogResponseHandler());
    // Add more response handlers as needed
    
    return handlers;
  }
} 