import { CoffeeIcon, DropletIcon, ClubIcon as FootballIcon, HeartPulseIcon, ParkingMeterIcon as ParkingIcon, UsersIcon } from "lucide-react";

const amenities = [
  { name: "Changing Rooms", icon: UsersIcon },
  { name: "Drinking Water", icon: DropletIcon },
  { name: "Parking Space", icon: ParkingIcon },
  { name: "First Aid Kit", icon: HeartPulseIcon },
  { name: "Rest Area", icon: CoffeeIcon },
  { name: "Equipment Rental", icon: FootballIcon },
];

export function AmenitiesSection() {
  return (
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
  );
} 