export interface ContentItem {
  id: string;
  type: "photo" | "drawing" | "music" | "about";
  title: string;
  description?: string;
  url: string;
  dateCreated: string;
  category?: string;
}

export interface GalleryProps {
  items: ContentItem[];
  type: "photo" | "drawing";
}

export interface ViewerProps {
  items: ContentItem[];
  initialIndex?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface CategoryProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export type NavigationType = "photo" | "drawing" | "music" | "about";
