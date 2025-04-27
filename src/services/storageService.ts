// Type definitions for content management
export type ContentType = "photo" | "drawing" | "music" | "about";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  url?: string;
  youtubeUrl?: string;
  pdfUrl?: string;
  dateCreated: Date;
}

const STORAGE_KEY = "cms_content";

// File storage paths
const STORAGE_PATHS = {
  photo: "/photos/",
  drawing: "/drawings/",
  music: "/music/",
  about: "/"
};

// Initialize localStorage with empty content if none exists
const initializeStorage = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      content: {
        about: {
          text: "",
          dateUpdated: new Date().toISOString(),
          backgroundImage: "/background.jpg"
        },
        photos: [],
        drawings: [],
        music: []
      }
    }));
  }
};

// Call initialization when the service is first loaded
initializeStorage();

// Retrieve content for a specific type (photos, drawings, music, or about page)
export const getContent = (contentType: ContentType): any => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  
  // Special handling for about page content
  if (contentType === "about") {
    return data.content.about;
  }
  
  // Return array for other content types (photos, drawings, music)
  return data.content[`${contentType}s`] || [];
};

// Save a file to the public directory and return its path
export const saveFileToPublic = async (file: File, contentType: ContentType): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`http://localhost:3001/api/upload?type=${contentType}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const data = await response.json();
    // Ensure the path starts with /uploads
    return data.filePath.startsWith('/uploads') ? data.filePath : `/uploads${data.filePath}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

// Add new content item (photo, drawing, music, or about page update)
export const addContent = async (item: Omit<ContentItem, "id" | "dateCreated">): Promise<boolean> => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    // Handle about page content separately
    if (item.type === "about") {
      data.content.about = {
        ...data.content.about,
        text: item.description || data.content.about.text || "",
        dateUpdated: new Date().toISOString(),
        backgroundImage: item.url || data.content.about.backgroundImage
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    
    // For other content types (photos, drawings, music)
    const contentList = `${item.type}s`;
    const newItem = {
      ...item,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString(),
    };
    
    if (!data.content[contentList]) {
      data.content[contentList] = [];
    }
    
    data.content[contentList].push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error adding content:", error);
    return false;
  }
};

// Retrieve a specific content item by ID
export const getContentById = (contentType: ContentType, id: string): ContentItem | null => {
  try {
    if (contentType === "about") return null;
    
    const contentList = `${contentType}s`;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    return data.content[contentList]?.find((item: ContentItem) => item.id === id) || null;
  } catch (error) {
    console.error("Error retrieving content:", error);
    return null;
  }
};

// Update an existing content item
export const updateContent = async (item: ContentItem): Promise<boolean> => {
  try {
    if (item.type === "about") {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      data.content.about = {
        ...data.content.about,
        text: item.description || data.content.about.text || "",
        dateUpdated: new Date().toISOString(),
        backgroundImage: item.url || data.content.about.backgroundImage
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    
    const contentList = `${item.type}s`;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    const contentIndex = data.content[contentList].findIndex(
      (c: ContentItem) => c.id === item.id
    );

    if (contentIndex !== -1) {
      data.content[contentList][contentIndex] = {
        ...item,
        dateUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating content:", error);
    return false;
  }
};

// Delete a content item
export const deleteContent = (contentType: ContentType, id: string): boolean => {
  try {
    const contentList = `${contentType}s`;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    // Find the item to get its URL
    const item = data.content[contentList].find((c: ContentItem) => c.id === id);
    if (item && item.url) {
      // Remove the file from localStorage
      localStorage.removeItem(`file_${item.url}`);
    }
    
    data.content[contentList] = data.content[contentList].filter(
      (c: ContentItem) => c.id !== id
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    return false;
  }
};

// Convert a file to a data URL for storage
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = reject;
    
    reader.readAsDataURL(file);
  });
};

// Get file data from the server
export const getFileData = (filePath: string): string => {
  // If it's already a full URL, return it as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  // If it's a YouTube URL, return it as is
  if (filePath.includes('youtube.com') || filePath.includes('youtu.be')) {
    return filePath;
  }
  // If it's a local file path, ensure it's properly formatted
  if (!filePath.startsWith('/uploads')) {
    filePath = `/uploads${filePath}`;
  }
  // Return the full URL with the backend server address
  return `http://localhost:3001${filePath}`;
};

// Load existing files from the upload directories
export const loadExistingFiles = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/files');
    if (!response.ok) {
      throw new Error('Failed to load existing files');
    }
    const files = await response.json();
    
    // Update localStorage with existing files
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    // Clear existing content arrays
    data.content.photos = [];
    data.content.drawings = [];
    data.content.music = [];
    
    // Add files to appropriate arrays
    files.forEach((file: { path: string, type: string }) => {
      const fileName = file.path.split('/').pop() || '';
      const title = fileName.split('.')[0]; // Use filename as title
      
      const item = {
        id: Date.now().toString(),
        type: file.type as ContentType,
        title: title,
        url: file.path,
        dateCreated: new Date().toISOString()
      };
      
      if (file.type === 'photo') {
        data.content.photos.push(item);
      } else if (file.type === 'drawing') {
        data.content.drawings.push(item);
      } else if (file.type === 'music') {
        data.content.music.push(item);
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error loading existing files:', error);
    return false;
  }
};