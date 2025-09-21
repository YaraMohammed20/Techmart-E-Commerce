import React from "react";

interface LoadingSpinnerProps {
  className?: string; 
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div
      className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary ${className || ""}`}
    />
  );
};
