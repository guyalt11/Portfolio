import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import uploadRoutes from './routes/upload';
import contentRoutes from './routes/content';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
const publicPath = path.join(__dirname, '../public');
const uploadPath = path.join(publicPath, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`Created upload directory: ${uploadPath}`);
}

app.use('/uploads', express.static(uploadPath));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);

// Get files by type
app.get('/api/files/:type', (req, res) => {
  const type = req.params.type;
  const typeDir = type === 'drawing' ? 'drawings' : type + 's';
  const dirPath = path.join(uploadPath, typeDir);
  
  if (!fs.existsSync(dirPath)) {
    return res.json([]);
  }
  
  const files = fs.readdirSync(dirPath).map(file => ({
    name: file,
    path: `/uploads/${typeDir}/${file}`
  }));
  
  res.json(files);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Static files are being served from: ${uploadPath}`);
});
