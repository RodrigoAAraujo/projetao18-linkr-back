import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.routes.js"

import { Refresh } from "./refresh.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes)
setTimeout(() => {
   Refresh(25000) 
}, 3000000);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
