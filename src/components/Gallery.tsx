import { useState, useCallback, memo, useEffect } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import ImageViewer from "./ImageViewer";
import { useInView } from 'react-intersection-observer';

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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className="bg-white p-2 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden rounded-md">
        {inView ? (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
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

  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / 3),
    getScrollElement: () => parentRef,
    estimateSize: () => 300,
    overscan: 5,
  });

  useEffect(() => {
    if (parentRef) parentRef.scrollTop = 0;
  }, [parentRef]);

  return (
    <div>
      <div
        ref={setParentRef}
        className="h-[80vh] overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const startIndex = virtualRow.index * 3;
            const rowItems = items.slice(startIndex, startIndex + 3);

            return (
              <VirtualRow
                key={virtualRow.index}
                virtualRow={virtualRow}
                items={items}
                startIndex={startIndex}
                onImageClick={handleOpenImage}
              />
            );
          })}
        </div>
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