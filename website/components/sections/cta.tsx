import { Button } from "@/components/ui/button";
import { CalendarIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
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
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent hover:text-white cursor-pointer"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 