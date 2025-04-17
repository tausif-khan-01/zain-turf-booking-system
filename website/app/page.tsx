"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  ChevronRightIcon,
  UsersIcon,
  DropletIcon,
  ParkingMeterIcon as ParkingIcon,
  HeartPulseIcon,
  CoffeeIcon,
  ClubIcon as FootballIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageModal } from "@/components/ui/image-modal";

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

const features = [
  {
    title: "Premium Quality Turf",
    description:
      "FIFA-approved artificial grass for optimal playing experience",
    icon: SparklesIcon,
  },
  {
    title: "24/7 Availability",
    description: "Book your slot any time of the day",
    icon: ClockIcon,
  },
  {
    title: "Professional Maintenance",
    description: "Regular maintenance to ensure perfect playing conditions",
    icon: ShieldCheckIcon,
  },
  {
    title: "Floodlit Facility",
    description: "High-quality LED floodlights for night games",
    icon: SunIcon,
  },
];

const amenities = [
  { name: "Changing Rooms", icon: UsersIcon },
  { name: "Drinking Water", icon: DropletIcon },
  { name: "Parking Space", icon: ParkingIcon },
  { name: "First Aid Kit", icon: HeartPulseIcon },
  { name: "Rest Area", icon: CoffeeIcon },
  { name: "Equipment Rental", icon: FootballIcon },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

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
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section with Carousel */}
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
                className="  size-12  "
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-primary">Zain</span> Turf
              </h1>
            </div>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
              Experience professional football at its finest. Our FIFA-approved
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

      {/* Quick Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-none">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPinIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-600">
                    Near Lotus Garden, Jintur Naka, Parbhani, Maharashtra 431401
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-none">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClockIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Operating Hours</h3>
                  <p className="text-gray-600">Open 24/7</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-none">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <PhoneIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Contact Us</h3>
                  <p className="text-gray-600">+91-1234567890</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Premium Features
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We provide top-notch facilities to ensure you have the best
              football experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-none group hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Amenities We Offer
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <amenity.icon className="w-10 h-10 text-primary mb-3" />
                <span className="font-medium text-center">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
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
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
      />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Book your slot now and experience the best football turf in
              Parbhani
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Book Your Slot
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent  hover:text-white cursor-pointer"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-8 border-none shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    "The turf quality is exceptional. Playing here feels like
                    being in a professional stadium. The facilities are clean
                    and well-maintained. Definitely the best football turf in
                    the area!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold">Customer {index + 1}</h4>
                      <p className="text-sm text-gray-500">Regular Player</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and About */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full  flex items-center justify-center mr-3">
                  <Image
                    src="/logo.jpg"
                    alt="Zain Turf"
                    className="rounded-full w-12 h-12"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    <span className="text-primary">Zain</span> Turf
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Premium Turf Playground facility in Parbhani offering
                FIFA-approved playing surfaces for both casual and competitive
                matches.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/booking"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Book Now
                  </a>
                </li>
                <li>
                  <a
                    href="/gallery"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">
                    Near Lotus Garden, Jintur Naka, Parbhani, Maharashtra 431401
                  </span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-400">+91-1234567890</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-gray-400">info@zainturf.com</span>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-gray-400">24 Hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-gray-400">24 Hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-gray-400">24 Hours</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Zain Turf. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
