import { plainToInstance } from 'class-transformer';
import { IMessageParser } from '../../application/interfaces/IMessageParser';
import { TimyAIRegisterRequest, TimyAISendLogRequest, TimyAISendUserRequest } from '../../types/commands';
import { TimyAIGetAllLogResponse } from '../../types/responses';
import { PossibleTimyAIMessage, TimyAIMessageClass } from '../../types/shared';

export class MessageParser implements IMessageParser {
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

  private _transformToTypedMessage(
    plainObject: Record<string, unknown>,
    identifier: string,
    isRequest: boolean
  ): PossibleTimyAIMessage {
    const MessageClass = this._getMessageClass(identifier, isRequest);
    
    if (!MessageClass) {
      console.warn(`No class mapping for ${isRequest ? 'command' : 'response'}: ${identifier}. Using plain object.`);
      return plainObject;
    }
    
    try {
      return plainToInstance(MessageClass, plainObject, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error(
        `Error transforming message for ${isRequest ? 'command' : 'response'} ${identifier}. Using plain object.`,
        error
      );
      return plainObject;
    }
  }

  private _getMessageClass(
    identifier: string, 
    isRequest: boolean,
  ): TimyAIMessageClass | null {
    if (isRequest) {
      // Determine if it's a terminal-to-server command or a server-to-terminal command
      switch (identifier) {
        // Terminal-to-server commands
        case 'reg': return TimyAIRegisterRequest;
        case 'sendlog': return TimyAISendLogRequest;
        case 'senduser': return TimyAISendUserRequest;
        default: return null;
      }
    } else { // It's a response
      switch (identifier) {
        case 'getalllog': return TimyAIGetAllLogResponse;
        // Add mappings for other expected responses here
        default: return null;
      }
    }
  }
} 