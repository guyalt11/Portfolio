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
  const [rawContent, setRawContent] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
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
      
      if (data.music) {
        setMusic(data.music.map((item: any, index: number) => ({
          id: `music-${index}`,
          type: "music",
          title: item.title || '',
          description: item.description || '',
          url: item.path || '',
          dateCreated: item.date || new Date().toISOString()
        })));
      }
      
      setRawContent(data);
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
      const response = await fetch('http://localhost:3001/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: id }),
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

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "Error",
        description: "New password must be at least 4 characters long",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    
    try {
      if (user?.username && changePassword(user.username, newPassword)) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Error",
          description: "Failed to change password",
          variant: "destructive",
        });
      }
    } finally {
      setPasswordLoading(false);
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
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
              
              {/* Debug Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Content from getFiles:</h3>
                      <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify({
                          hasPhotos: photos.length > 0,
                          photosCount: photos.length,
                          firstPhoto: photos[0]
                        }, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Raw Content from API:</h3>
                      <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(rawContent, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                                onClick={() => handleOpenEditModal("photo", photo.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteContent("photo", photo.id)}
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
                                onClick={() => handleDeleteContent("drawing", drawing.id)}
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
                    <p className="text-site-gray">No music tracks uploaded yet</p>
                  ) : (
                    <div className="space-y-4">
                      {music.map((track) => (
                        <div key={track.id} className="bg-white rounded-md p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{track.title}</h3>
                            {track.description && (
                              <p className="text-site-gray text-sm">{track.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {track.youtubeUrl ? (
                              <span className="text-sm text-site-gray">YouTube video</span>
                            ) : track.url ? (
                              <audio controls src={track.url} className="max-w-xs" />
                            ) : null}
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditModal("music", track.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteContent("music", track.id)}
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

          <TabsContent value="settings">
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </Button>
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