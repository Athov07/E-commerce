import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import addressRouter from "./routes/address.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Standard Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/", addressRouter);

// Error Handling Middleware
app.use(errorHandler);

export { app };