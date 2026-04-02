import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// 1. Global Middleware
app.use(helmet()); 
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));   
app.use(morgan('dev')); 

// 2. Auth Service Proxy (Handles /api/auth and /api/admin)
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',   
    '^/api/admin': '/admin', 
  },
  onProxyReq: (proxyReq, req) => {
    console.log(`[Gateway]: Forwarding ${req.method} ${req.url} -> Auth Service`);
  },
  onError: (err, req, res) => {
    res.status(502).json({ message: 'Auth Service is down', error: err.message });
  }
});

// 3. Apply Routes
app.use('/api/auth', authProxy);
app.use('/api/admin', authProxy);


app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});