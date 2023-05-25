import dotenv from "dotenv";
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { makeChain } from "./makechain.js";
import { pinecone } from "./pinecone.js";
import e from "express";
const PINECONE_NAME_SPACE = 'pdf-test'; 

export const runPine = async (query) => {
    try {
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '');

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
        const result = await chain.call({
            question: query,
            chat_history: [],
        });
        return result;
    } catch (error) {
        console.log(error);
    }

}