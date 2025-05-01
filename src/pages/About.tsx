import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ParallaxHeader from "@/components/ParallaxHeader";

interface AboutContent {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
  dateUpdated: string;
}

const About = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('https://portfolio-backend-yeop.onrender.com/api/content');
        const data = await response.json();
        
        if (data.abouts) {
          setAboutContent(data.abouts.map((item: any, index: number) => ({
            id: `about-${index}`,
            type: "about",
            title: item.title || '',
            description: item.description || '',
            dateCreated: item.date || new Date().toISOString()
          })));
        }
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };
    loadContent();
  }, []);

  const backgroundImage = "https://portfolio-backend-yeop.onrender.com/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 max-w-4xl bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">About</h1>
        
        {aboutContent.length > 0 ? (
          <div className="grid gap-6">
            {aboutContent.map((item) => (
              <div key={item.id} className="p-4 bg-white/50 rounded-lg shadow-sm break-words overflow-hidden">
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                {item.description && (
                  <p className="text-gray-600 mb-4">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No about content available yet.</p>
        )}
      </div>
      
      <Navbar />
    </div>
  );
};

export default About;