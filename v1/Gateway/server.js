import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import httpProxy from 'http-proxy';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

// middleware setup

app.use(morgan('dev')); // Request logging
app.use(helmet()); // Secure headers
app.use(cors({
  origin: ['http://localhost:5173'], // Adjust this as per frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204,
}));


// health check route

app.get('/healthCheck/checkHealthOfServer', (req, res) => {
  res.status(200).json({ message: 'Gateway Server is up and running' });
});


// prosy setup

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

// Forward Origin Header (CORS issues fix)
proxy.on('proxyReq', (proxyReq, req) => {
  if (req.headers.origin) {
    proxyReq.setHeader('origin', req.headers.origin);
  }
});

// Optional: Error handler for proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).json({ error: 'Proxy error', details: err.message });
});


// proxy routes

app.use('/v1/r', (req, res) => {
  req.url = req.url.replace(/^\/v1\/r/, '');
  proxy.web(req, res, {
    target: process.env.READER_SERVER,
  });
});

app.use('/v1/w', (req, res) => {
  req.url = req.url.replace(/^\/v1\/w/, '');
  proxy.web(req, res, {
    target: process.env.WRITER_SERVER,
  });
});

app.use('/v1/auth', (req, res) => {
  req.url = req.url.replace(/^\/v1\/auth/, '');
  proxy.web(req, res, {
    target: process.env.AUTH_SERVER,
  });
});


// server start

app.listen(port, () => {
  console.log(`🌐 Gateway server is running on port ${port}`);
});
