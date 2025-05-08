import Navigation from "@/components/Navigation";
import PhoneNavbar from "@/components/PhoneNavbar";
import { useEffect, useState } from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub, FaYoutube, FaWhatsapp } from 'react-icons/fa';

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
        const response = await fetch('content.json');
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

  const backgroundImage = "/uploads/home/background3.jpg";
  
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-[#dbe3eb] via-[#cbd5d8] to-[#a0aec0] -z-1" />
      <div className="hidden md:block">
        <Navigation />
      </div>
      <div className="relative p-8 mt-16 mb-10 mx-auto max-w-7xl md:max-w-80pct bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">About</h1>
        
        {aboutContent.length > 0 ? (
          <div className="grid gap-6">
            {aboutContent.map((item) => (
              <div key={item.id} className="p-4 bg-white/50 rounded-lg shadow-sm break-words overflow-hidden">
                <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                {item.description && (
                  <div className="text-gray-600 mb-4 whitespace-pre-line break-words w-full">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No about content available yet.</p>
        )}
        {/* Social Media Icons*/}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/guy_altmann/" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#E1306C] hover:text-[#C13584]">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/guy.altmann/" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#3B5998] hover:text-[#2E4885]">
              <FaFacebook />
            </a>
            <a href="https://www.linkedin.com/in/guy-altmann/" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#0077B6] hover:text-[#005580]">
              <FaLinkedin />
            </a>
            <a href="https://github.com/guyalt11" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#171A21] hover:text-site-dark-gray">
              <FaGithub />
            </a>
            <a href="https://www.youtube.com/@guyalt11" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#FF0000] hover:text-[#CC0000]">
              <FaYoutube />
            </a>
            <a
              href="mailto:guyalt11@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                alt="Gmail"
                className="w-8 h-8 transition duration-200 group-hover:brightness-90"
              />
            </a>
            <a href="https://wa.me/972546981525" target="_blank" rel="noopener noreferrer" className="text-3xl text-[#25D366] hover:text-[#128C7E]">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <PhoneNavbar />
      </div>
    </div>
  );
};

export default About;
