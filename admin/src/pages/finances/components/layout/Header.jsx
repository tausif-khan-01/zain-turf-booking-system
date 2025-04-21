import React from "react";

export const Header = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-4 w-64 mt-2 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {children}
    </div>
  );
}; 