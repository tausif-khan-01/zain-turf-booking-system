import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

export function PageLoader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

PageLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
