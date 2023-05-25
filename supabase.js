import dotenv from "dotenv";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { makeChain } from "./makechain.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
dotenv.config();

//const loader = new PDFLoader("pdfs/test.pdf");
//const docs = await loader.load();

//export const docs_data = () => {
//    return docs;
//}

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export const run = async (query) => {
    const client = createClient(url, privateKey);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 10,
    });

    const docOutput = await splitter.splitDocuments(docs);

    // const vectorStore = await SupabaseVectorStore.fromDocuments(
    //     docOutput,
    //     new OpenAIEmbeddings(),
    //     {
    //         client,
    //         tableName: "new_docs",
    //         queryName: "docs_match",
    //     }
    //);

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
            client,
            tableName: "new_docs",
            queryName: "docs_match",
        }
    );

    const chain = makeChain(vectorStore);

    const result = await chain.call({
        question: query,
        context: docs,
        chat_history: [],
    });

    const resultOne = await vectorStore.similaritySearch(query, 5);
    console.log(resultOne);
    return resultOne;
    //return 1;
};
