import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
require("dotenv").config();

import { authRouter, userRouter } from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;
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

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});