import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ParallaxHeader from "@/components/ParallaxHeader";
import ImageModal from "@/components/ImageModal";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
}

const Drawings = () => {
  const [content, setContent] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('https://portfolio-backend-yeop.onrender.com/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    loadContent();
  }, []);

  // Process drawings from content
  const drawings = content?.drawings?.map((drawing: any, index: number) => ({
    id: `drawing-${index}`,
    type: 'drawing',
    title: drawing.title,
    description: drawing.description,
    url: drawing.path,
    dateCreated: drawing.date
  })) || [];

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      if (selectedImageIndex === drawings.length - 1) {
        setSelectedImageIndex(0);
      } else {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      if (selectedImageIndex === 0) {
        setSelectedImageIndex(drawings.length - 1);
      } else {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
    }
  };

  const selectedImage = selectedImageIndex !== null ? drawings[selectedImageIndex] : null;
  const backgroundImage = "https://portfolio-backend-yeop.onrender.com/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-4xl bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">Drawings</h1>
        
        {drawings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing, index) => (
              <div 
                key={drawing.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={drawing.url} 
                  alt={drawing.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 text-center">{drawing.title}</h3>
                  {drawing.description && (
                    <p className="text-gray-600">{drawing.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No drawings available yet.</p>
        )}
      </div>
      
      <ImageModal
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title || ""}
        description={selectedImage?.description}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={true}
        hasPrevious={true}
      />
      
      <Navbar />
    </div>
  );
};

export default Drawings;