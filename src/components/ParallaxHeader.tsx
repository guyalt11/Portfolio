import { useEffect, useState, useRef } from "react";

// Props interface for the ParallaxHeader component
interface ParallaxHeaderProps {
  imageUrl: string;
  fullHeight?: boolean;
}

/**
 * ParallaxHeader Component
 * Creates a parallax scrolling effect for the background image
 * 
 * @param imageUrl - URL of the background image
 * @param fullHeight - Whether the   should take full height of the viewport
 */
const ParallaxHeader = ({ imageUrl, fullHeight = true }: ParallaxHeaderProps) => {
  const [offset, setOffset] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScrollDistance = documentHeight - viewportHeight;
      
      setOffset(scrollPosition);
      setMaxScroll(maxScrollDistance);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate the parallax effect based on scroll position and page length
  const calculateParallax = () => {
    if (maxScroll === 0) return 0;
    
    // Calculate how far we've scrolled as a percentage
    const scrollPercent = offset / maxScroll;
    
    // Limit the maximum parallax effect to 10% of the viewport height
    const maxParallax = window.innerHeight * 0.1;
    
    // Apply a subtle easing function to make the effect more natural
    const easedScroll = Math.pow(scrollPercent, 0.5);
    
    return -easedScroll * maxParallax;
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden`}
    >
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `translateY(${calculateParallax()}px)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '120%', // Increased to prevent gaps during parallax
          width: '120%', // Increased to prevent gaps during parallax
          left: '-10%', // Center the increased width
          top: '-10%' // Center the increased height
        }}
      />
      {/* Solid overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default ParallaxHeader;