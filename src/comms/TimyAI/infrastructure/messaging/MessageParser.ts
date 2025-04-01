import { plainToInstance } from 'class-transformer';
import { injectable } from 'tsyringe';
import { IMessageParser } from '../../application/interfaces/IMessageParser';
import { TimyAIRegisterRequest, TimyAISendLogRequest, TimyAISendUserRequest } from '../../types/commands';
import { TimyAIGetAllLogResponse } from '../../types/responses';
import { PossibleTimyAIMessage, TimyAIMessageClass } from '../../types/shared';
import { createLogger } from '../../../../utils/logger';

/**
 * Parses messages from a terminal into a typed message
 */
@injectable()
export class MessageParser implements IMessageParser {
  private readonly logger = createLogger('MessageParser');
  
  constructor() {
    this.logger.debug('MessageParser initialized');
  }
  
  /**
   * Parse a message from a timy terminal into a typed message
   * @param data - The message to parse
   * @returns The parsed message
   */
  parseMessage(data: Buffer): {
    message: PossibleTimyAIMessage;
    identifier: string | null;
    isRequest: boolean;
  } {
    const plainObject = this._parseJson(data);
    const { identifier, isRequest } = this._identifyMessageType(plainObject);
    
    if (!identifier) {
      return { message: plainObject, identifier: null, isRequest: false };
    }
    
    const message = this._transformToTypedMessage(plainObject, identifier, isRequest);
    
    return { message, identifier, isRequest };
  }

  /**
   * Parse the json data from a terminal into a plain object
   * @param data - The message to parse
   * @returns The parsed message
   */
  private _parseJson(data: Buffer): Record<string, unknown> {
    try {
      const parsed = JSON.parse(data.toString('utf-8'));
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Parsed JSON is not an object');
      }
      return parsed as Record<string, unknown>;
    } catch (error) {
      throw new Error(`Error parsing message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Identify the type of message
   * @param message - The message to identify
   * @returns The identifier and whether the message is a request
   */
  private _identifyMessageType(message: Record<string, unknown>): { 
    identifier: string | null; 
    isRequest: boolean 
  } {
    if (typeof message.cmd === 'string') {
      return { identifier: message.cmd, isRequest: true };
    } 
    
    if (typeof message.ret === 'string') {
      return { identifier: message.ret, isRequest: false };
    }
    
    return { identifier: null, isRequest: false };
  }

  /**
   * Transform a plain object into a typed message
   * @param plainObject - The plain object to transform
   * @param identifier - The identifier of the message
   * @param isRequest - Whether the message is a request
   * @returns The typed message or the plain object if no mapping exists
   */
  private _transformToTypedMessage(
    plainObject: Record<string, unknown>,
    identifier: string,
    isRequest: boolean
  ): PossibleTimyAIMessage {
    const MessageClass = this._getMessageClass(identifier, isRequest);
    
    if (!MessageClass) {
      this.logger.warn({ identifier, isRequest }, `No class mapping. Using plain object.`);
      return plainObject;
    }
    
    try {
      return plainToInstance(MessageClass, plainObject, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ 
        err: error, 
        identifier, 
        isRequest 
      }, 'Error transforming message. Using plain object.');
      return plainObject;
    }
  }

  /**
   * Get the message class for the given identifier and request type
   * @param identifier - The identifier of the message
   * @param isRequest - Whether the message is a request
   * @returns The message class or null if no mapping exists
   */
  private _getMessageClass(
    identifier: string, 
    isRequest: boolean,
  ): TimyAIMessageClass | null {
    if (isRequest) {
      switch (identifier) {
        case 'reg': return TimyAIRegisterRequest;
        case 'sendlog': return TimyAISendLogRequest;
        case 'senduser': return TimyAISendUserRequest;
        default: return null;
      }
    } else { 
      switch (identifier) {
        case 'getalllog': return TimyAIGetAllLogResponse;
        default: return null;
      }
    }
  }
} 