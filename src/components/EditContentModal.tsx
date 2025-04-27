
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ContentItem, 
  ContentType, 
  getContentById, 
  updateContent,
  fileToDataUrl 
} from "@/services/storageService";
import { toast } from "@/components/ui/use-toast";

interface EditContentModalProps {
  contentType: ContentType;
  contentId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContentUpdated: () => void;
}

const EditContentModal = ({
  contentType,
  contentId,
  isOpen,
  onOpenChange,
  onContentUpdated,
}: EditContentModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadType, setUploadType] = useState("info"); // "info", "file", "youtube", "pdf"
  const [item, setItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      const contentItem = getContentById(contentType, contentId);
      if (contentItem) {
        setItem(contentItem);
        setTitle(contentItem.title || "");
        setDescription(contentItem.description || "");
        setYoutubeUrl(contentItem.youtubeUrl || "");
      }
    }
  }, [isOpen, contentId, contentType]);

  const handleSubmit = async () => {
    if (!item) return;
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const updatedItem = { ...item, title, description };
      
      if (uploadType === "file" && file) {
        updatedItem.url = await fileToDataUrl(file);
      }
      
      if (uploadType === "youtube") {
        updatedItem.youtubeUrl = youtubeUrl;
      }
      
      if (uploadType === "pdf" && pdfFile) {
        updatedItem.pdfUrl = await fileToDataUrl(pdfFile);
      }

      const success = updateContent(updatedItem);
      
      if (success) {
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
        setFile(null);
        setPdfFile(null);
        onContentUpdated();
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {contentType}</DialogTitle>
        </DialogHeader>

        <Tabs value={uploadType} onValueChange={setUploadType}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            {contentType === "music" && <TabsTrigger value="youtube">YouTube</TabsTrigger>}
            <TabsTrigger value="file">{contentType === "music" ? "Audio" : "Image"}</TabsTrigger>
            {contentType === "music" && <TabsTrigger value="pdf">PDF</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>
          
          {contentType === "music" && (
            <TabsContent value="youtube" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-youtube">YouTube URL</Label>
                <Input
                  id="edit-youtube"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-file">
                {contentType === "music" ? "Audio File" : "Image File"}
              </Label>
              <Input
                id="edit-file"
                type="file"
                accept={contentType === "music" ? "audio/*" : "image/*"}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </TabsContent>
          
          {contentType === "music" && (
            <TabsContent value="pdf" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pdf">Sheet Music (PDF)</Label>
                <Input
                  id="edit-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                />
                {pdfFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected PDF: {pdfFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditContentModal;