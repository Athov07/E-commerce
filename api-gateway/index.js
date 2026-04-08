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


const productProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Product Request -> ${req.method} ${req.url}`);
  }
});


// Cart Service Proxy Configuration
const cartProxy = createProxyMiddleware({
  target: process.env.CART_SERVICE_URL,
  pathRewrite: {
    '^/api/cart': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Cart Request -> ${req.method} ${req.url}`);
  }
});


const addressProxy = createProxyMiddleware({
  target: process.env.ADDRESS_SERVICE_URL,
  pathRewrite: {
    '^/api/address': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Address Request -> ${req.method} ${req.url}`);
  }
});


const orderProxy = createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  pathRewrite: {
    '^/api/order': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Order Request -> ${req.method} ${req.url}`);
  }
});


const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL, 
  pathRewrite: {
    '^/api/payment': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Payment Request -> ${req.method} ${req.url}`);
  }
});


const profileProxy = createProxyMiddleware({
  target: process.env.PROFILE_SERVICE_URL,
  pathRewrite: {
    '^/api/profile': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Profile Request -> ${req.method} ${req.url}`);
  }
});


const inventoryProxy = createProxyMiddleware({
  target: process.env.INVENTORY_SERVICE_URL,
  pathRewrite: {
    '^/api/inventory': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Inventory Request -> ${req.method} ${req.url}`);
  }
});



// 3. Apply Routes
app.use('/api/auth', authProxy);
app.use('/api/admin', authProxy);
app.use("/api/products", productProxy);
app.use('/api/cart', cartProxy);
app.use("/api/address", addressProxy);
app.use("/api/order", orderProxy);
app.use("/api/payment", paymentProxy);
app.use("/api/profile", profileProxy);
app.use('/api/inventory', inventoryProxy);



app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});