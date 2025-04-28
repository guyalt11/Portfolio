import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ParallaxHeader from "@/components/ParallaxHeader";

interface AboutContent {
  title: string;
  description: string;
  url: string;
  date: string;
  dateUpdated: string;
}

const About = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    loadContent();
  }, []);

  const aboutContent = content?.about ? {
    title: content.about.title,
    description: content.about.description,
    url: content.about.path,
    date: content.about.date,
    dateUpdated: content.about.dateUpdated
  } : null;

  const backgroundImage = "http://localhost:3001/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-4xl bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray">About</h1>
        
        {aboutContent ? (
          <div className="space-y-6">
            <img 
              src={aboutContent.url} 
              alt={aboutContent.title} 
              className="w-full h-96 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-4">{aboutContent.title}</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{aboutContent.description}</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Last updated: {new Date(aboutContent.dateUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">About content not available yet.</p>
        )}
      </div>
      
      <Navbar />
    </div>
  );
};

export default About;