import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/products", productRouter);

// Global Error Middleware
app.use(errorHandler);

export { app };