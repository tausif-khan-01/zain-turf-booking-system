import { AmenitiesSection } from "@/components/sections/amenities";
import { CTASection } from "@/components/sections/cta";
import { FeaturesSection } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { GallerySection } from "@/components/sections/gallery";
import { HeroSection } from "@/components/sections/hero";
import { LocationSection } from "@/components/sections/location";
import { QuickInfoSection } from "@/components/sections/quick-info";
import config from "@/lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zain Turf - Premium Football Turf in Parbhani",
  description:
    "Experience professional football at Zain Turf, featuring FIFA-approved artificial turf, 24/7 availability, and premium facilities in Parbhani, Maharashtra.",
  keywords:
    "football turf, sports facility, Parbhani, artificial turf, football ground, sports complex",
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            name: config.turf.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: config.turf.address,
              addressLocality: "Parbhani",
              addressRegion: "Maharashtra",
              postalCode: "431401",
              addressCountry: "IN",
            },
            telephone: config.turf.phone,
            email: config.turf.email,
            openingHours: "Mo-Su 00:00-23:59",
            priceRange: "$$",
            image: "/logo.jpg",
            description:
              "Premium football turf facility with FIFA-approved artificial grass, available 24/7 for both casual and competitive matches.",
          }),
        }}
      />

      <HeroSection />
      <QuickInfoSection />
      <FeaturesSection />
      <AmenitiesSection />
      <GallerySection />
      <CTASection />
      <LocationSection />
      <Footer />
    </main>
  );
}
