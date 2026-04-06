import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import profileRoutes from "./routes/profile.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use("/api/profile", profileRoutes);
app.use("/", profileRoutes);

app.use(errorHandler);

export default app;