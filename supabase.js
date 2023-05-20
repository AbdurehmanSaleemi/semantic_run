import dotenv from "dotenv";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
dotenv.config();

//const loader = new PDFLoader("pdfs/doc3.pdf");
//const docs = await loader.load();

//export const docs_data = () => {
    //return docs;
//}

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export const run = async (query) => {
    const client = createClient(url, privateKey);
    // const vectorStore = await SupabaseVectorStore.fromDocuments(
    //     docs,
    //     new OpenAIEmbeddings(),
    //     {
    //         client,
    //         tableName: "new_docs",
    //         queryName: "docs_match",
    //     }
    // );

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
            client,
            tableName: "new_docs",
            queryName: "docs_match",
        }
    );

    const resultOne = await vectorStore.similaritySearch(query, 5);

    return resultOne;
    //return 1;
};
