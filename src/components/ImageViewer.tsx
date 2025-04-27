import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { ContentItem } from '@/services/fileService';

/**
 * ImageViewer Component
 * Displays an enlarged view of images/sketches with navigation controls
 * 
 * @param props - Component props
 * @param props.items - Array of ContentItems to display in the viewer
 * @param props.initialIndex - Initial index to display (defaults to 0)
 * @param props.isOpen - Boolean to control dialog open state
 * @param props.onOpenChange - Function to call when dialog open state changes
 */
interface ImageViewerProps {
  items: ContentItem[];
  initialIndex?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageViewer = ({ items, initialIndex = 0, isOpen, onOpenChange }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const currentItem = items[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="relative">
          {currentItem && (
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
          
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="rounded-full"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium">{currentItem?.title}</h3>
          {currentItem?.description && (
            <p className="text-gray-600 mt-2">{currentItem.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;