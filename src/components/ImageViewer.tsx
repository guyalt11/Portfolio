import React, { useState, useCallback, useEffect, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface ContentItem {
  id: string;
  type: "photo" | "drawing" | "music" | "about";
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
}

interface ImageViewerProps {
  items: ContentItem[];
  initialIndex?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageContent = memo(({ item }: { item: ContentItem }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={item.url}
        alt={item.title}
        className="w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
});

const ImageViewer = ({ items, initialIndex = 0, isOpen, onOpenChange }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onOpenChange(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onOpenChange]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isOpen) return;
    const nextIndex = (currentIndex + 1) % items.length;
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    preloadImage(items[nextIndex].url);
    preloadImage(items[prevIndex].url);
  }, [currentIndex, items, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="relative">
          {currentItem && <ImageContent item={currentItem} />}
          
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-white text-4xl bg-gray-800/40 shadow-none border-none focus:outline-none"
            >
              {'X'}
            </Button>
          </div>
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full text-white text-4xl bg-gray-800/40 shadow-none border-none focus:outline-none"
            >
              {'<'}
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="rounded-full text-white text-4xl bg-gray-800/40 shadow-none border-none focus:outline-none"
            >
              {'>'}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          {currentItem?.title && (
            <h3 className="bg-white/80 text-xl px-8 py-1 rounded-lg font-medium">{currentItem?.title}</h3>
          )}
          {currentItem?.description && (
            <p className="bg-white/80 text-lg px-4 py-1 rounded-lg font-medium mt-2">{currentItem.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;