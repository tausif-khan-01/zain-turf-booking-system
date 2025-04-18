"use client";

import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/ui/image-modal";
import Image from "next/image";
import { useState } from "react";

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Gallery</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Take a look at our world-class facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => {
            return (
              <div
                key={index}
                className="relative h-64 rounded-lg overflow-hidden group"
              >
                <Image
                  src={`/img/turf-${index + 1}.jpg`}
                  alt={`Zain Turf - Play Ground ${index + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent hover:text-white cursor-pointer"
                    onClick={() =>
                      setSelectedImage({
                        src: `/img/turf-${index + 1}.jpg`,
                        alt: `Zain Turf - Play Ground ${index + 1}`,
                      })
                    }
                  >
                    View Larger
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
      />
    </section>
  );
} 