import express from "express";
import cors from "cors";
import { run } from "./supabase.js";
import { runBot } from "./chat.js";
import { runChain } from "./chain.js";
import { runPine } from "./run.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000

//console.log(output);
//const prompt = await runPine("Give me summary of the document");
// if(prompt === 1){
//     console.log("Training Completed");
// }

//console.log(prompt);

app.post("/fetch_result", (req, res) => {
    const { query } = req.body;
    console.log(query);
    const result = runPine(query);
    result.then((output) => {
        res.send(output);
    }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});
