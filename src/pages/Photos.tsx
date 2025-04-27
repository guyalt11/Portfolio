import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import { useEffect, useState } from "react";
import { ContentItem, getFiles } from "@/services/fileService";
import ParallaxHeader from "@/components/ParallaxHeader";

const Photos = () => {
  const [photos, setPhotos] = useState<ContentItem[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80");

  useEffect(() => {
    const loadPhotos = async () => {
      const loadedPhotos = await getFiles("photo");
      setPhotos(loadedPhotos);
    };
    
    loadPhotos();
  }, []);

  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-4xl bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray">Photos</h1>
        <Gallery items={photos} type="photo" />
      </div>
      
      <Navbar />
    </div>
  );
};

export default Photos