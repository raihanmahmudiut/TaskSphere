// ImageViewerDialog.tsx
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type ImageViewerDialogProps = {
  images: string | string[];
  titles?: string | string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ImageViewerDialog: React.FC<ImageViewerDialogProps> = ({
  images,
  titles,
  open,
  onOpenChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert single image/title to array if needed
  const imageArray = Array.isArray(images) ? images : [images];
  const titleArray = Array.isArray(titles)
    ? titles
    : titles
      ? [titles]
      : imageArray.map((_, i) => `Image ${i + 1}`);

  const hasMultipleImages = imageArray.length > 1;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + imageArray.length) % imageArray.length
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-7xl max-h-[95vh] p-0">
        <div className="relative flex items-center justify-center bg-black/10 w-full h-full min-h-[60vh]">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 z-50"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation buttons - only show if multiple images */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-50"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-50"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full h-[85vh]">
              <Image
                src={imageArray[currentIndex]}
                alt={titleArray[currentIndex]}
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              />
            </div>
            <div className="bg-white w-full p-4 text-center font-medium">
              {titleArray[currentIndex]}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerDialog;
