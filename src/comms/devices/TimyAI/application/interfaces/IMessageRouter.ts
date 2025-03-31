import { WebSocket } from 'ws';
import { PossibleTimyAIMessage } from "@/comms/devices/TimyAI/types/shared";

export interface IMessageRouter {
  /**
   * Route a message to the appropriate handler
   * @param ws - WebSocket connection
   * @param message - Parsed message
   * @param identifier - Message identifier
   * @param isRequest - Whether it's a request or response
   */
  routeMessage(
    ws: WebSocket, 
    message: PossibleTimyAIMessage, 
    identifier: string, 
    isRequest: boolean
  ): void;
} 