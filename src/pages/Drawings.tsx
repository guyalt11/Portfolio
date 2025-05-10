import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneNavbar from "@/components/PhoneNavbar"; 
import ImageViewer from "@/components/ImageViewer";

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

  const backgroundImage = "/uploads/home/background3.jpg";
  
  const categories = ["Pencils", "Colors", "Portraits", "Dumps"];
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const categoryFromUrl = urlParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl && categories.includes(categoryFromUrl) ? categoryFromUrl : categories[0]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    navigate(`/drawings?category=${category}`);
  };

  const filteredDrawings = drawings.filter(d => d.category === selectedCategory);
  
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
      <div className="fixed inset-0 bg-gradient-to-br from-[#dbe3eb] via-[#cbd5d8] to-[#a0aec0] -z-1" />
      <div className="hidden sm:block">
        <Navigation />
      </div>
      <div className="relative p-8 sm:mt-16 mb-10 mx-auto max-w-7xl md:max-w-80pct bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">Drawings</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-6 text-sm sm:text-base md:text-lg font-semibold">
          {categories.map((category, index) => (
            <span key={category} className="flex items-center">
              <button
                onClick={() => handleCategoryChange(category)}
                className={`transition border-b-2 ${
                  selectedCategory === category
                    ? "border-site-dark-gray text-site-dark-gray"
                    : "border-transparent hover:border-gray-400 text-gray-700"
                }`}
              >
                {category}
              </button>
              {index < categories.length - 1 && <span className="mx-2 text-gray-400">|</span>}
            </span>
          ))}
        </div>

        
        {drawings.length > 0 ? (
          <div className="mb-8 sm:mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {drawings
              .filter((drawing) => drawing.category === selectedCategory)
              .map((drawing, index) => (
                <div 
                  key={drawing.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-shadow"
                  onClick={() => setSelectedImageIndex(index)}
                >
                <img 
                  src={drawing.url+".webp"} 
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
        <footer className="left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 py-4 fixed bottom-0 z-50">
          © 2025 Guy Altmann. All rights reserved.
        </footer>
      </div>
      <div className="block sm:hidden">
        <PhoneNavbar />
      </div>  
      <ImageViewer
        items={filteredDrawings}
        initialIndex={selectedImageIndex ?? 0}
        isOpen={selectedImageIndex !== null}
        onOpenChange={(open) => setSelectedImageIndex(open ? selectedImageIndex : null)}
      />
    </div>
  );
};

export default Drawings;
