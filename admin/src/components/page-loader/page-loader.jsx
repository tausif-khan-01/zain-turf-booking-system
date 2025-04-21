import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader({ 
  isLoading, 
  fullScreen = true,
  className,
  message = "Loading...",
  size = "default"
}) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base"
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-background/80 backdrop-blur-sm",
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 
          className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )} 
        />
        <p className={cn(
          "text-muted-foreground",
          textSizeClasses[size]
        )}>
          {message}
        </p>
      </div>
    </div>
  );
}

PageLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
  message: PropTypes.string,
  size: PropTypes.oneOf(["sm", "default", "lg"])
};
