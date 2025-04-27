
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ParallaxHeader from "@/components/ParallaxHeader";
import { getContent } from "@/services/storageService";

const About = () => {
  const [content, setContent] = useState({
    text: "",
    backgroundImage: ""
  });
  const [aboutContent, setAboutContent] = useState({ backgroundImage: "" });

  useEffect(() => {
    const aboutContent = getContent("about");
    setContent(aboutContent);
    setAboutContent(aboutContent);
  }, []);

  const backgroundImage = aboutContent.backgroundImage || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-4xl bg-white/90 backdrop-blur-sm my-20 mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">About</h1>
        
        <div className="prose prose-gray max-w-none">
          {content.text ? (
            content.text.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
            ))
          ) : (
            <p className="text-gray-500">No content yet. Please add content in the CMS.</p>
          )}
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default About;