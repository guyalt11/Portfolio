import Navbar from "@/components/Navbar";
import ParallaxHeader from "@/components/ParallaxHeader";

const Index = () => {
  const backgroundImage = "/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      <Navbar />
    </div>
  );
};

export default Index;