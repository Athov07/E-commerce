import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import orderRouter from "./routes/order.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", orderRouter);
// app.use("/api/orders", orderRouter);
app.use(errorHandler);

export { app };