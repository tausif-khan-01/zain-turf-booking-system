"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const carouselImages = [
  {
    src: "/img/turf-1.jpg",
    alt: "Zain Turf - Play Ground 1",
  },
  {
    src: "/img/turf-2.jpg",
    alt: "Zain Turf - Play Ground 2",
  },
  {
    src: "/img/turf-3.jpg",
    alt: "Zain Turf - Play Ground 3",
  },
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[80vh] md:h-[90vh] lg:h-screen">
      <div className="absolute inset-0 w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div
          className={cn(
            "max-w-2xl text-white transition-all duration-1000 transform",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          )}
        >
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/logo.jpg"
              alt="Zain Turf Logo"
              width={80}
              height={80}
              className="size-12"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-primary">Zain</span> Turf
            </h1>
          </div>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
            Experience professional turf at its finest. Our FIFA-approved
            artificial turf provides the perfect playing surface for both
            casual and competitive matches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Book Now
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent hover:text-white cursor-pointer"
              >
                Explore Features
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
} 