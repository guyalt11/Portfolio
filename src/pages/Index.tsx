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
    </div>
  );
};

export default Index;