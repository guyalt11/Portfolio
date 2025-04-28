import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser, changePassword, logout } from "@/services/authService";
import ContentUploader from "@/components/ContentUploader";
import EditContentModal from "@/components/EditContentModal";
import { Edit, Upload } from "lucide-react";

interface ContentItem {
  id: string;
  type: "photo" | "drawing" | "music" | "about";
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
}

const CMS = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutContent, setAboutContent] = useState({
    text: "",
    dateUpdated: "",
    backgroundImage: "",
  });
  const [photos, setPhotos] = useState<ContentItem[]>([]);
  const [drawings, setDrawings] = useState<ContentItem[]>([]);
  const [music, setMusic] = useState<ContentItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContentType, setEditingContentType] = useState<"photo" | "drawing" | "music">("photo");
  const [editingContentId, setEditingContentId] = useState("");
  
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Load content
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/content');
      const data = await response.json();
      
      if (data.about) {
        setAboutContent(data.about);
      }
      
      if (data.photos) {
        setPhotos(data.photos.map((item: any, index: number) => ({
          id: `photo-${index}`,
          type: "photo",
          title: item.title || '',
          description: item.description || '',
          url: item.path || '',
          dateCreated: item.date || new Date().toISOString()
        })));
      }
      
      if (data.drawings) {
        setDrawings(data.drawings.map((item: any, index: number) => ({
          id: `drawing-${index}`,
          type: "drawing",
          title: item.title || '',
          description: item.description || '',
          url: item.path || '',
          dateCreated: item.date || new Date().toISOString()
        })));
      }
      
      if (data.musics) {
        setMusic(data.musics.map((item: any, index: number) => ({
          id: `music-${index}`,
          type: "music",
          title: item.title || '',
          description: item.description || '',
          url: item.path || '',
          dateCreated: item.date || new Date().toISOString()
        })));
      }

    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    }
  };

  const handleOpenEditModal = (type: "photo" | "drawing" | "music", id: string) => {
    setEditingContentType(type);
    setEditingContentId(id);
    setEditModalOpen(true);
  };

  const handleDeleteContent = async (type: "photo" | "drawing" | "music", id: string) => {
    try {
      
      const response = await fetch('http://localhost:3001/api/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: id, type }),
      });

      if (response.ok) {
        toast({ title: "Content deleted successfully" });
        loadContent(); // Refresh content
      } else {
        throw new Error("Failed to delete content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-site-light-gray">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-site-dark-gray">Content Management System</h1>
          <div className="flex items-center gap-2">
            <span className="text-site-gray">Logged in as {user?.username}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Button onClick={() => navigate("/")}>View Site</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="drawings">Drawings</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="grid gap-6">
              <ContentUploader contentType="about" onContentAdded={loadContent} />
              <Card>
                <CardHeader>
                  <CardTitle>Current About Content</CardTitle>
                  <CardDescription>
                    Last updated: {aboutContent.dateUpdated 
                      ? new Date(aboutContent.dateUpdated).toLocaleString() 
                      : "Never"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-md border">
                    {aboutContent.text ? (
                      aboutContent.text.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-site-gray">No content added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Background Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {aboutContent.backgroundImage ? (
                    <div className="bg-white p-4 rounded-md border">
                      <img 
                        src={aboutContent.backgroundImage} 
                        alt="Background" 
                        className="w-full max-h-64 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <p className="text-site-gray">No background image set</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid gap-6">
              <ContentUploader contentType="photo" onContentAdded={loadContent} />
              <Card>
                <CardHeader>
                  <CardTitle>Manage Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  {photos.length === 0 ? (
                    <p className="text-site-gray">No photos uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {photos.map((photo) => (
                        <div key={photo.id} className="bg-white rounded-md overflow-hidden shadow-sm">
                          <div className="aspect-square relative">
                            <img 
                              src={photo.url} 
                              alt={photo.title} 
                              className="absolute inset-0 w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{photo.title}</h3>
                            <div className="flex justify-end mt-2 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditModal("photo", photo.url)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteContent("photo", photo.url)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drawings">
            <div className="grid gap-6">
              <ContentUploader contentType="drawing" onContentAdded={loadContent} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Manage Drawings</CardTitle>
                </CardHeader>
                <CardContent>
                  {drawings.length === 0 ? (
                    <p className="text-site-gray">No drawings uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {drawings.map((drawing) => (
                        <div key={drawing.id} className="bg-white rounded-md overflow-hidden shadow-sm">
                          <div className="aspect-square relative">
                            <img 
                              src={drawing.url} 
                              alt={drawing.title} 
                              className="absolute inset-0 w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{drawing.title}</h3>
                            <div className="flex justify-end mt-2 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditModal("drawing", drawing.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteContent("drawing", drawing.url)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="music">
            <div className="grid gap-6">
              <ContentUploader contentType="music" onContentAdded={loadContent} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Manage Music</CardTitle>
                </CardHeader>
                <CardContent>
                  {music.length === 0 ? (
                    <p className="text-site-gray">No music uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {music.map((music) => (
                        <div key={music.id} className="bg-white rounded-md overflow-hidden shadow-sm w-fit">
                          <iframe
                            className="max-w-xs"
                            src={music.url}
                            title={music.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                          <div className="p-3 flex justify-between items-center">
                            <h3 className="font-medium">{music.title}</h3>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditModal("music", music.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteContent("music", music.url)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Content Modal */}
      <EditContentModal
        contentType={editingContentType}
        contentId={editingContentId}
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        onContentUpdated={loadContent}
      />
    </div>
  );
};

export default CMS;