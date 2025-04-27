
import Navbar from "@/components/Navbar";
import ParallaxHeader from "@/components/ParallaxHeader";
import { getContent } from "@/services/storageService";
import { useEffect } from "react";

const Index = () => {
  // Get the background image from about page content
  const aboutContent = getContent("about");
  const backgroundImage = aboutContent.backgroundImage || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80";

  // Add hover effect to menu items with subtle separation
  useEffect(() => {
    const menuItems = document.querySelectorAll('.nav-menu-item');
    const SEPARATION_DISTANCE = 12; // Reduced from previous value for subtlety
    
    menuItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        menuItems.forEach((otherItem, otherIndex) => {
          if (otherItem !== item) {
            // Calculate distance based on position relative to hovered item
            const distance = Math.abs(index - otherIndex);
            const translateY = SEPARATION_DISTANCE * (otherIndex < index ? -0.5 : 0.5);
            const opacity = 1 - (distance * 0.15); // More subtle opacity change
            
            (otherItem as HTMLElement).style.transform = `translateY(${translateY}px)`;
            (otherItem as HTMLElement).style.opacity = `${opacity}`;
          } else {
            (otherItem as HTMLElement).style.opacity = '1';
          }
        });
      });

      item.addEventListener('mouseleave', () => {
        menuItems.forEach(otherItem => {
          (otherItem as HTMLElement).style.transform = 'translateY(0)';
          (otherItem as HTMLElement).style.opacity = '0.75'; // Return to default opacity
        });
      });
    });

    // Cleanup event listeners
    return () => {
      menuItems.forEach(item => {
        item.removeEventListener('mouseenter', () => {});
        item.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <ParallaxHeader imageUrl={backgroundImage} />
      <Navbar />

      {/* Add custom styles for menu animation */}
      <style>{`
        .nav-menu-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Index;