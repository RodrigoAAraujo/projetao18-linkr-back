import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Refresh } from "./refresh";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setTimeout(() => {
   Refresh(25000) 
}, 30000);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
