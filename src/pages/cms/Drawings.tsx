import { useEffect, useState } from "react";

interface Drawing {
  path: string;
  title: string;
  description: string;
  date: string;
}

const DrawingsCMS = () => {
  const [content, setContent] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('https://portfolio-backend-yeop.onrender.com/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading content:", error);
        setError("Failed to load drawings");
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
      formData.append('type', 'drawing');

      const response = await fetch('https://portfolio-backend-yeop.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reload content after successful upload
      const newContent = await fetch('https://portfolio-backend-yeop.onrender.com/api/content').then(res => res.json());
      setContent(newContent);
      
      // Reset form
      setSelectedFile(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      setError("Failed to upload drawing");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm("Are you sure you want to delete this drawing?")) return;

    try {
      const response = await fetch('https://portfolio-backend-yeop.onrender.com/api/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path,
          type: 'drawing'
        }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Reload content after successful delete
      const newContent = await fetch('https://portfolio-backend-yeop.onrender.com/api/content').then(res => res.json());
      setContent(newContent);
    } catch (error) {
      console.error("Error deleting drawing:", error);
      setError("Failed to delete drawing");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Drawings Management</h1>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Drawing</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drawing File
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
              {isUploading ? "Uploading..." : "Upload Drawing"}
            </button>
          </form>
        </div>

        {/* Drawings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Drawings</h2>
          {content?.drawings?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.drawings.map((drawing: Drawing, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <img
                    src={drawing.path}
                    alt={drawing.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium">{drawing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{drawing.description}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(drawing.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(drawing.path)}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No drawings uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingsCMS; 