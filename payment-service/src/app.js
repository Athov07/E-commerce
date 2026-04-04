import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.use(errorHandler);

export { app };