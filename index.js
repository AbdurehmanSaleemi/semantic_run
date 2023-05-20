import express from "express";
import cors from "cors";
import { run, docs_data } from "./supabase.js";
import { runBot } from "./chat.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

//console.log(output);
//const prompt = await run();
// if(prompt === 1){
//     console.log("Training Completed");
// } 

app.post("/fetch_result", (req, res) => {
    const { query } = req.body;
    const result = run(query);
    result.then((output) => {
        res.send(output);
    }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});