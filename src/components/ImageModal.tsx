import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title, 
  description,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: ImageModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrevious) {
        onPrevious?.();
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
        >
          <X size={24} />
        </button>

        {/* Navigation arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 p-4 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 p-4 hover:bg-white/10 rounded-full"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image */}
        <div className="bg-white rounded-lg overflow-hidden pt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-h-[70vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Title and description */}
          <div className="p-4 text-center">
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 