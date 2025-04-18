import { Card } from "@/components/ui/card";
import { ClockIcon, ShieldCheckIcon, SparklesIcon, SunIcon } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Premium Features
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We provide top-notch facilities to ensure you have the best
            experience
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
  );
} 