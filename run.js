import dotenv from "dotenv";
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { makeChain } from "./makechain.js";
import { pinecone } from "./pinecone.js";
import { OpenAI } from 'langchain/llms/openai';

const PINECONE_NAME_SPACE = 'pdf-test';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

export const runPine = async (query) => {
    try {
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '')

        /* create vectorstore*/
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({}),
            {
                pineconeIndex: index,
                textKey: 'text',
                namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
            },
        );
        const chain = makeChain(vectorStore);
        //Ask a question using chat history
        const response = await chain.call({
            question: query,
            chat_history: [],
        });
        console.log('response', response);
        return response;
    } catch (error) {
        console.log(error);
    }

}