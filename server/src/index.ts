import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
require("dotenv").config();

import { authRouter, colorsRouter, userRouter, artistRouter } from "./routes";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) return callback(null, true);
        else return callback(new Error('Not allowed by CORS'));
    }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/colors", colorsRouter)
app.use("/artists", artistRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});