import { PossibleTimyAIMessage } from "@/comms/TimyAI/types/shared";

export interface IMessageParser {
  
  /**
   * Parse raw data into a structured message
   * @param data - Raw binary data
   */
  parseMessage(data: Buffer): {
    message: PossibleTimyAIMessage;
    identifier: string | null;
    isRequest: boolean;
  };
} 