import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import PhoneNavbar from "@/components/PhoneNavbar";

interface ContentItem {
  id: string;
  type: "photo" | "drawing" | "music" | "about";
  title: string;
  description?: string;
  url: string;
  youtubeUrl?: string;
  pdfUrl?: string;
  dateCreated: string;
}

const Music = () => {
  const [musicContent, setMusicContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('content.json');
        const data = await response.json();
        
        if (data.musics) {
          setMusicContent(data.musics.map((item: any, index: number) => ({
            id: `music-${index}`,
            type: "music",
            title: item.title || '',
            description: item.description || '',
            youtubeUrl: item.path,
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
      <div className="hidden sm:block">
        <Navigation />
      </div>
      <div className="relative p-8 mb-10 mx-auto max-w-7xl md:max-w-80pct bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-site-dark-gray text-center">Music</h1>
        
        {musicContent.length > 0 ? (
          <div className="mb-8 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {musicContent.map((item) => (
              <div key={item.id} className="p-4 bg-white/50 rounded-lg shadow-sm">
                {item.youtubeUrl && (
                  <div className="aspect-video w-full max-w-2xl mx-auto mb-4">
                    <iframe
                      src={item.youtubeUrl}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}
                {item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    View Sheet Music
                  </a>
                )}
                <h2 className="text-2xl font-semibold mb-2 text-center">{item.title}</h2>
                {item.description && (
                  <p className="text-gray-600 mb-4">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No music content available yet.</p>
        )}
        <footer className="left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 py-4 fixed bottom-0 z-50">
          © 2025 Guy Altmann. All rights reserved.
        </footer>
      </div>
      <div className="block sm:hidden">
        <PhoneNavbar />
      </div>  
    </div>
  );
};

export default Music;
