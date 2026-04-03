import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app.use("/api/cart", cartRouter);
app.use("/", cartRouter);


app.use(errorHandler);

export { app };