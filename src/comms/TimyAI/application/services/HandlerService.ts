import { injectable, inject } from 'tsyringe';
import { ITimyAIMessageHandler } from '../interfaces/ITimyAIMessageHandler';
import { createLogger } from '../../../../utils/logger';

/**
 * Service for managing message handlers
 */
@injectable()
export class HandlerService {
  private readonly logger = createLogger('HandlerService');
  private readonly requestHandlers = new Map<string, ITimyAIMessageHandler>();
  private readonly responseHandlers = new Map<string, ITimyAIMessageHandler>();

  constructor(
    @inject('RegistrationHandler') private registrationHandler: ITimyAIMessageHandler,
    @inject('ClockingDataHandler') private clockingDataHandler: ITimyAIMessageHandler,
    @inject('UserDataHandler') private userDataHandler: ITimyAIMessageHandler,
    @inject('GetAllLogResponseHandler') private getAllLogResponseHandler: ITimyAIMessageHandler
  ) {
    this.initializeHandlers();
  }

  /**
   * Initialize request and response handlers
   */
  private initializeHandlers(): void {
    // Set up request handlers
    this.requestHandlers.set('reg', this.registrationHandler);
    this.requestHandlers.set('sendlog', this.clockingDataHandler);
    this.requestHandlers.set('senduser', this.userDataHandler);
    
    // Set up response handlers
    this.responseHandlers.set('getalllog', this.getAllLogResponseHandler);
    
    this.logger.debug('Message handlers initialized');
  }

  /**
   * Get all request handlers
   * @returns A map of request handlers
   */
  getRequestHandlers(): Map<string, ITimyAIMessageHandler> {
    return this.requestHandlers;
  }

  /**
   * Get all response handlers
   * @returns A map of response handlers
   */
  getResponseHandlers(): Map<string, ITimyAIMessageHandler> {
    return this.responseHandlers;
  }
} 