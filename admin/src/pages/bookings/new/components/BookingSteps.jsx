import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// interface BookingStepsProps {
//   currentStep: number;
// }

export function BookingSteps({ currentStep }) {
  return (
    <CardHeader className="pb-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl text-card-foreground">Booking Details</CardTitle>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= 1 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div
            className={`w-6 sm:w-12 h-1 ${
              currentStep >= 2 ? "bg-primary" : "bg-muted"
            }`}
          ></div>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= 2 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div
            className={`w-6 sm:w-12 h-1 ${
              currentStep >= 3 ? "bg-primary" : "bg-muted"
            }`}
          ></div>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= 3 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
        </div>
      </div>
      <CardDescription className="text-muted-foreground">
        {currentStep === 1 && "Select your preferred date and time slots"}
        {currentStep === 2 && "Enter your personal details"}
        {currentStep === 3 && "Review and confirm your booking"}
      </CardDescription>
    </CardHeader>
  );
}
