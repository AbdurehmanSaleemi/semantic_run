import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";

export const runBot = async (prompt) => {
    const chat = new ChatOpenAI(
        {
            streaming: true,
        }
    );
    const response = await chat.call([
        new HumanChatMessage(
            `Format this in human readable format : ${prompt}`
        ),
    ]);
    return response;
};