import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

import env from './config/env.js';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { closePdfEngine } from './services/pdfService.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use('/api', apiLimiter);

app.use('/uploads', express.static(path.join(process.cwd(), env.uploadDir)));

app.get('/', (req, res) =>
  res.json({
    success: true,
    message: 'ResumeForge AI API',
    hint: 'This is the backend API. The app runs at the client dev server (default http://localhost:5173).',
    health: '/api/health',
  })
);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResumeForge AI API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] ResumeForge AI API listening on port ${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`[server] Received ${signal}, shutting down gracefully...`);
  await closePdfEngine();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
