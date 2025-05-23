import Navbar from "@/components/Navbar";
import { useEffect } from "react";

const Index = () => {
  const backgroundImage = "/uploads/home/background.jpg";
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <Navbar />
      <footer className="text-center text-sm text-white opacity-80 sm:opacity-100 sm:text-gray-500 py-4 fixed bottom-0 w-full z-50">
        © 2025 Guy Altmann. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;