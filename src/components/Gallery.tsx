import { useState } from "react";
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

const Gallery = ({ items, type }: GalleryProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOpenImage = (index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-site-gray">No {type === "photo" ? "photos" : "drawings"} available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white p-2 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleOpenImage(index)}
          >
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-site-gray mt-1">{item.description}</p>
              )}
            </div>
          </div>
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
};

export default Gallery