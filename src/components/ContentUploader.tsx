import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadFile } from "@/services/fileService";

interface ContentUploaderProps {
  contentType: "photo" | "drawing" | "music" | "about";
  onContentAdded: () => void;
}

interface ContentEntry {
  path: string;
  title: string;
  description: string;
  date: string;
}

const ContentUploader = ({ contentType, onContentAdded }: ContentUploaderProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    try {
      const fileUrl = await uploadFile(file, contentType, title, description);
      
      // Create content entry
      const contentEntry: ContentEntry = {
        path: fileUrl,
        title: title,
        description: description,
        date: new Date().toISOString()
      };

      // Save to JSON file
      await saveContentToJson(contentEntry, contentType);
      
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} uploaded successfully`);
      setTitle("");
      setDescription("");
      setFile(null);
      onContentAdded();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContentToJson = async (entry: ContentEntry, type: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          entry
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content entry');
      }
    } catch (error) {
      console.error('Error saving content entry:', error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="file" className="text-sm font-medium">
            File
          </label>
          <Input
            id="file"
            type="file"
            accept={contentType === "music" ? "audio/*" : "image/*"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          {file && (
            <p className="text-sm text-gray-500">
              Selected: {file.name}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default ContentUploader;