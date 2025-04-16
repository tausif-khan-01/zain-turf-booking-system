"use client";

import * as React from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  autoplayInterval?: number;
  className?: string;
}

export function AutoCarousel({
  images,
  autoplayInterval = 5000,
  className,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-scrolling functionality
  React.useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(autoplay);
  }, [emblaApi, autoplayInterval]);

  // Update selected index on scroll
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div
      className={cn(
        "relative h-[50vh] md:h-[100dvh] w-full overflow-hidden",
        className
      )}
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              selectedIndex === index
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
