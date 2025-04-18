import { Card } from "@/components/ui/card";
import { ClockIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import config from "@/lib/config";

export function QuickInfoSection() {
  return (
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
                <p className="text-gray-600">{config.turf.address}</p>
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
                <p className="text-gray-600">{config.turf.phone}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 