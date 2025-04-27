export type ContentType = "photo" | "drawing" | "music" | "about";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
}

const BACKEND_URL = "http://localhost:3001";

// Get all files of a specific type
export const getFiles = async (type: ContentType): Promise<ContentItem[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/files/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    const files = await response.json();
    return files.map((file: { path: string, name: string }) => ({
      id: file.name,
      type,
      title: file.name.split('.')[0],
      url: `${BACKEND_URL}${file.path}`,
      dateCreated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

// Upload a file
export const uploadFile = async (file: File, type: ContentType, title?: string, description?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/upload?type=${encodeURIComponent(type)}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }
    
    const data = await response.json();
    return `${BACKEND_URL}${data.filePath}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete a file
export const deleteFile = async (type: ContentType, filename: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/files/${type}/${filename}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}; 