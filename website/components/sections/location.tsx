import { MapPinIcon, PhoneIcon } from "lucide-react";
import config from "@/lib/config";

export function LocationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Us</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Visit us at {config.turf.extendedAddress}
          </p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full h-0 pb-[56.25%] md:pb-[50%] lg:pb-[40%]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.664858948158!2d76.74572909999999!3d19.2534325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd019813ecb62b1%3A0x4d63d5c82e9d49d4!2sZain%20Sports%20Resorts%20%26%20Turf!5e0!3m2!1sen!2sin!4v1744909295703!5m2!1sen!2sin"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zain Sports Resorts & Turf Location"
              aria-label="Google Maps showing location of Zain Sports Resorts & Turf"
            ></iframe>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <MapPinIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Our Address</h3>
              <p className="text-gray-600">{config.turf.address}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <PhoneIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Contact Us</h3>
              <p className="text-gray-600">{config.turf.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 