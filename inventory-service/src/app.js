import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import inventoryRoutes from "./routes/inventory.routes.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/inventory", inventoryRoutes);

// GLOBAL ERROR MIDDLEWARE (Must be last)
app.use(errorMiddleware);

export default app;