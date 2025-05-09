import Navbar from "@/components/Navbar";
import ParallaxHeader from "@/components/ParallaxHeader";
import PhoneNavbar from "@/components/PhoneNavbar";

const Index = () => {
  const backgroundImage = "/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      <Navbar />
      <div className="block sm:hidden">
        <PhoneNavbar />
      </div>
      <footer className="text-center text-sm text-white opacity-80 md:opacity-100 md:text-gray-500 py-4 fixed bottom-0 w-full z-50">
        © 2025 Guy Altmann. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;