import Navbar from "@/components/Navbar";
import ParallaxHeader from "@/components/ParallaxHeader";

const Index = () => {
  const backgroundImage = "http://localhost:3001/uploads/home/background.jpg";
  
  return (
    <div className="min-h-screen">
      <ParallaxHeader imageUrl={backgroundImage} />
      <Navbar />
    </div>
  );
};

export default Index;