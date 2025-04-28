import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !youtubeUrl) {
      toast.error("Please select a file or provide a YouTube URL to upload");
      return;
    }

    setIsLoading(true);
    try {
      let fullPath = "";

      if (contentType !== "music" && contentType !== "about") {
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('title', title);
        formData.append('description', description);

        console.log('Uploading file with type:', contentType);

        const uploadResponse = await fetch(`http://localhost:3001/api/upload?type=${contentType}`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Failed to upload file');
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
        fullPath = uploadResult.fullPath;
      } else if (contentType === "music") {
        fullPath = youtubeUrl;
      }
      // First, upload the file
      if (contentType !== "music") {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        console.log('Uploading file with type:', contentType);

        const uploadResponse = await fetch(`http://localhost:3001/api/upload?type=${contentType}`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Failed to upload file');
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
        fullPath = uploadResult.fullPath;
      }

      // Then, update the content.json with the new entry
      const contentEntry: ContentEntry = {
        path: fullPath,
        title: title,
        description: description,
        date: new Date().toISOString(),
      };

      const contentResponse = await fetch('http://localhost:3001/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: contentType,
          entry: contentEntry
        }),
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to update content.json');
      }

      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} uploaded successfully`);
      setTitle("");
      setDescription("");
      setFile(null);
      onContentAdded();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setIsLoading(false);
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
          {contentType === "music" ? (
            <Input
              id="youtubeUrl"
              type="text"
              placeholder="Enter YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
          ) : (
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          )}
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