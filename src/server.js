import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.routes.js"
import postsRoutes from "./routes/posts.routes.js"
import timelineRoutes from "./routes/timeline.routes.js"
import { Refresh } from "./refresh.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(timelineRoutes);
app.use(postsRoutes);

setInterval(() => {
   Refresh(60000) //900000
}, 15000); //120000

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
