import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Path to the content JSON file
const contentPath = path.join(__dirname, '../../public/content.json');
const uploadPath = path.join(__dirname, '../../public/uploads');

// Ensure content file exists
if (!fs.existsSync(contentPath)) {
  fs.writeFileSync(contentPath, JSON.stringify({
    photos: [],
    drawings: [],
    music: [],
    about: {
      text: "",
      backgroundImage: "",
      dateUpdated: new Date().toISOString()
    }
  }));
}

// Get all content
router.get('/', (req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    res.json(content);
  } catch (error) {
    console.error('Error reading content:', error);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

// Add new content entry
router.post('/', (req, res) => {
  try {
    const { type, entry } = req.body;
    
    // Read existing content
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Handle about type differently
    if (type === 'about') {
      content.about = {
        ...content.about,
        ...entry,
        dateUpdated: new Date().toISOString()
      };
    } else {
      // Add new entry to the appropriate type array
      if (content[type + 's']) {
        content[type + 's'].push(entry);
      } else {
        content[type + 's'] = [entry];
      }
    }
    
    // Write updated content back to file
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Delete content entry and file
router.delete('/', (req, res) => {
  try {
    const { path: filePath, type } = req.body;
    
    if (!filePath || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read existing content
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Remove the entry from content.json
    const typeKey = type + 's';
    if (content[typeKey]) {
      content[typeKey] = content[typeKey].filter((item: any) => item.path !== filePath);
      fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    }

    // Delete the file
    const fileName = filePath.split('/').pop();
    const typeDir = type === 'drawing' ? 'drawings' : type + 's';
    const fullPath = path.join(uploadPath, typeDir, fileName || '');
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router; 