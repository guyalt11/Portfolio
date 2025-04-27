import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure directory exists
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type as string;
    const basePath = path.join(__dirname, '../../public/uploads');
    
    // Ensure base upload directory exists
    ensureDirectoryExists(basePath);
    
    let uploadPath = basePath;
    
    switch (type) {
      case 'photo':
        uploadPath = path.join(basePath, 'photos');
        break;
      case 'drawing':
        uploadPath = path.join(basePath, 'drawings');
        break;
      case 'music':
        uploadPath = path.join(basePath, 'music');
        break;
      case 'about':
        uploadPath = path.join(basePath, 'about');
        break;
      default:
        console.log('Invalid file type:', type);
        return cb(new Error('Invalid file type'), '');
    }
    
    // Ensure type-specific directory exists
    ensureDirectoryExists(uploadPath);
    
    console.log('Final upload path:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Configure multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware to validate type
const validateType = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const type = req.query.type as string;
  console.log('Type validation:', { type });

  if (!type || !['photo', 'drawing', 'music', 'about'].includes(type)) {
    console.log('Invalid type parameter:', type);
    return res.status(400).json({ error: 'Invalid content type' });
  }

  next();
};

// Upload route
router.post('/', validateType, upload.single('file'), (req, res) => {
  console.log('Upload request received:', {
    query: req.query,
    type: req.query.type,
    file: req.file
  });

  if (!req.file) {
    console.log('No file received in upload request');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File received:', {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    destination: req.file.destination,
    type: req.query.type
  });

  // Ensure the file path is correct
  const filePath = `/uploads/${req.query.type}s/${req.file.filename}`;
  console.log('Generated file path:', filePath);
  
  res.json({ 
    success: true, 
    filePath: filePath,
    fileName: req.file.filename,
    fullPath: `http://localhost:3001${filePath}`
  });
});

export default router; 