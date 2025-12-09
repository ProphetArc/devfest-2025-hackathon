'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/data';
import { Language } from '@/lib/i18n';

type LightboxProps = {
  images: ImagePlaceholder[];
  startIndex: number;
  onClose: () => void;
  lang: Language;
};

export function Lightbox({ images, startIndex, onClose, lang }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious, onClose]);
  
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-screen w-screen max-w-none border-0 bg-black/80 p-0 backdrop-blur-sm" hideCloseButton>
        <DialogTitle className="sr-only">Галерея изображений</DialogTitle>
        <div className="relative flex h-full w-full items-center justify-center">
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-50 h-12 w-12 text-white hover:bg-white/20 hover:text-white"
                onClick={onClose}
            >
                <X className="h-8 w-8" />
                <span className="sr-only">Close</span>
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 h-16 w-16 text-white hover:bg-white/20 hover:text-white"
                onClick={goToPrevious}
            >
                <ChevronLeft className="h-12 w-12" />
                <span className="sr-only">Previous Image</span>
            </Button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 z-50 -translate-y-1/2 h-16 w-16 text-white hover:bg-white/20 hover:text-white"
                onClick={goToNext}
            >
                <ChevronRight className="h-12 w-12" />
                <span className="sr-only">Next Image</span>
            </Button>
            )}
            
            {/* Image Display */}
            <div className="relative h-full w-full">
              <Image
                  key={currentImage.id}
                  src={currentImage.imageUrl}
                  alt={currentImage.description[lang]}
                  fill
                  className="object-contain animate-in fade-in"
                  sizes="100vw"
              />
            </div>

             {/* Description */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/50 px-4 py-2 text-center text-sm text-white">
                <p>{currentImage.description[lang]}</p>
                <p className='text-xs opacity-70'>({currentIndex + 1} / {images.length})</p>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
