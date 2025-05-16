import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

// interface PersonalDetailsFormProps {
//   formData: {
//     name: string;
//     phone: string;
//   };
//   onInputChange: ({ field, value }: { field: string; value: string }) => void;
// }

export function PersonalDetailsForm({ formData, onInputChange }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) =>
              onInputChange({ field: "name", value: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Whatsapp Number</Label>

          <PhoneInput
            value={formData.phone}
            onChange={(value) => onInputChange({ field: "phone", value })}
            placeholder="Enter your phone number"
            required
            defaultCountry="IN"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        We will booking information to your whatsapp number. So please ensure
        your whatsapp number is correct.
      </p>
    </div>
  );
}
