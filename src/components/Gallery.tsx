import { useState, useCallback, useRef, memo, useEffect } from "react";
import ImageViewer from "./ImageViewer";
import { ContentItem } from "@/types";

interface GalleryProps {
  items: ContentItem[];
  type: "photo" | "drawing";
}

const LazyImage = memo(({ item, onClick }: { item: ContentItem; onClick: () => void }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload image
  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.src = item.url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, item.url]);

  return (
    <div
      ref={imgRef}
      className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 will-change-transform cursor-pointer"
      onClick={onClick}
    >
      {isVisible && !error && (
        <>
          <img
            src={item.url}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"} group-hover:scale-110`}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        </>
      )}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
          Failed to load
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

const Gallery = memo(({ items, type }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenImage = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCloseImage = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Optimize re-renders by memoizing the grid
  const imageGrid = useCallback(() => (
    items.map((item, index) => (
      <LazyImage
        key={item.id}
        item={item}
        onClick={() => handleOpenImage(index)}
      />
    ))
  ), [items, handleOpenImage]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-site-gray">No {type}s available.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 auto-rows-max"
    >
      {imageGrid()}
      <ImageViewer
        isOpen={selectedIndex !== null}
        onClose={handleCloseImage}
        items={items}
        initialIndex={selectedIndex ?? 0}
      />
    </div>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;