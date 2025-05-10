import { useState, useCallback, memo, useEffect, useRef } from "react";
import ImageViewer from "./ImageViewer";

interface ContentItem {
  id: string;
  type: "photo" | "drawing" | "music" | "about";
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
}

interface GalleryProps {
  items: ContentItem[];
  type: "photo" | "drawing";
}

const LazyImage = memo(({ item, onClick }: { item: ContentItem; onClick: () => void }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="group bg-white p-2 rounded-md shadow-sm cursor-pointer will-change-transform"
      onClick={onClick}
      style={{
        transform: `scale(${isVisible ? '1' : '0.98'})`
      }}
    >
      <div className="aspect-square overflow-hidden rounded-md bg-gray-50">
        {isVisible && (
          <img
            ref={imgRef}
            src={item.url}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover transform transition-all duration-300 ease-out will-change-transform ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105`}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-site-gray mt-1">{item.description}</p>
        )}
      </div>
    </div>
  );
});

const VirtualRow = memo(({ virtualRow, items, startIndex, onImageClick }: {
  virtualRow: any;
  items: ContentItem[];
  startIndex: number;
  onImageClick: (index: number) => void;
}) => {
  const rowItems = items.slice(startIndex, startIndex + 3);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {rowItems.map((item, index) => (
        <LazyImage
          key={item.id}
          item={item}
          onClick={() => onImageClick(startIndex + index)}
        />
      ))}
    </div>
  );
});

const Gallery = memo(({ items, type }: GalleryProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOpenImage = useCallback((index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-site-gray">No {type === "photo" ? "photos" : "drawings"} available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 auto-rows-max">
        {items.map((item, index) => (
          <LazyImage
            key={item.id}
            item={item}
            onClick={() => handleOpenImage(index)}
          />
        ))}
      </div>

      <ImageViewer
        items={items}
        initialIndex={initialIndex}
        isOpen={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
});  

export default Gallery;