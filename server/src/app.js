import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from "./modules/auth/auth.routes.js"

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SupportDesk API is running"
    })
})

app.use("/api/v1/auth", authRoutes);

export default app;

