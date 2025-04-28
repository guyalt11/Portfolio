import { useEffect, useState } from "react";

interface Photo {
  path: string;
  title: string;
  description: string;
  date: string;
}

const PhotosCMS = () => {
  const [content, setContent] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log("Fetching content from API...");
        const response = await fetch('http://localhost:3001/api/content');
        const data = await response.json();
        console.log("Raw API Response:", data);
        console.log("Photos array exists:", !!data.photos);
        console.log("Number of photos:", data.photos?.length || 0);
        console.log("First photo:", data.photos?.[0]);
        setContent(data);
      } catch (error) {
        console.error("Error loading content:", error);
        setError("Failed to load photos");
      }
    };

    loadContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', 'photo');

      console.log("Uploading file...");
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await response.json();
      console.log("Upload response:", uploadResult);

      // Add a small delay to ensure the backend has processed the upload
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reload content after successful upload
      console.log("Fetching updated content...");
      const newContent = await fetch('http://localhost:3001/api/content').then(res => res.json());
      console.log("Updated content:", newContent);
      setContent(newContent);
      
      // Reset form
      setSelectedFile(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const response = await fetch('http://localhost:3001/api/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path,
          type: 'photo'
        }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Reload content after successful delete
      const newContent = await fetch('http://localhost:3001/api/content').then(res => res.json());
      setContent(newContent);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Photos Management</h1>

        {/* Debug Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Content Structure:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify({
                  hasContent: !!content,
                  hasPhotos: !!content?.photos,
                  photosCount: content?.photos?.length || 0,
                  contentKeys: content ? Object.keys(content) : []
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Raw Content:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Photo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </div>

        {/* Photos List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Photos</h2>
          {content?.photos?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.photos.map((photo: Photo, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <img
                    src={photo.path}
                    alt={photo.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium">{photo.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(photo.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(photo.path)}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No photos uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosCMS; 