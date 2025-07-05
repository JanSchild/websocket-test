import { IncomingMessage } from "./IncomingMessage.js";

export class IncomingMessageQueue {
    /**
     * @type {IncomingMessage[]}
     */
    static moveCommandQueue = [];

    /**
     * @param {IncomingMessage} message
    */
    static addToMoveCommandQueue(message) {
        IncomingMessageQueue.moveCommandQueue = IncomingMessageQueue.moveCommandQueue
            .filter(command => command.playerID != message.playerID);
        IncomingMessageQueue.moveCommandQueue.push(message);
        console.log(`Queue: ` + JSON.stringify(IncomingMessageQueue.moveCommandQueue));
    }

    /**
     * @returns {IncomingMessage[]}
     */
    static getMoveCommands() {
        return IncomingMessageQueue.moveCommandQueue;
    }

    static removeProcessedMoveCommands() {
        IncomingMessageQueue.moveCommandQueue = IncomingMessageQueue.moveCommandQueue
            .filter(command => !command.processed);
    }
}