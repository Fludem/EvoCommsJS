import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { RegistrationHandler } from '../handlers/RegistrationHandler';
import { ClockingDataHandler } from '../handlers/ClockingDataHandler';
import { UserDataHandler } from '../handlers/UserDataHandler';
import { GetAllLogResponseHandler } from '../handlers/GetAllLogResponseHandler';

export class HandlerFactory {
  static createRequestHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('reg', new RegistrationHandler());
    handlers.set('sendlog', new ClockingDataHandler());
    handlers.set('senduser', new UserDataHandler());
    
    return handlers;
  }

  static createResponseHandlers(): Map<string, ITimyAIMessageHandler> {
    const handlers = new Map<string, ITimyAIMessageHandler>();
    
    handlers.set('getalllog', new GetAllLogResponseHandler());
    return handlers;
  }
} 