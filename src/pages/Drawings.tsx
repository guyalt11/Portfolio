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
        const response = await fetch('content.json');
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
    category: drawing.category,
    dateCreated: drawing.date
  })) || [];

  const backgroundImage = "/uploads/home/background.jpg";
  
  const categories = ["Portraits", "Pencil", "Colors", "Dumps"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const filteredDrawings = drawings.filter(
    (drawing) => drawing.category === selectedCategory
  );

  const selectedImage = selectedImageIndex !== null ? filteredDrawings[selectedImageIndex] : null;
  
  const handleNext = () => {
    if (selectedImageIndex !== null) {
      if (selectedImageIndex === filteredDrawings.length - 1) {
        setSelectedImageIndex(0);
      } else {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      if (selectedImageIndex === 0) {
        setSelectedImageIndex(filteredDrawings.length - 1);
      } else {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
    }
  };
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 max-w-90pct md:max-w-80pct bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">Drawings</h1>
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                flex-1 py-1 px-3 sm:py-2 sm:px-4 md:py-3 md:px-6 
                rounded-full font-bold text-xs sm:text-sm md:text-lg 
                transition 
                ${selectedCategory === category ? "bg-site-dark-gray text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
              `}
            >
              {category}
            </button>
          ))}
        </div>
        
        {drawings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {drawings
              .filter((drawing) => drawing.category === selectedCategory)
              .map((drawing, index) => (
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
                  {drawing.title && (
                    <h3 className="text-lg font-medium mb-2 text-center">{drawing.title}</h3>
                  )}
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
