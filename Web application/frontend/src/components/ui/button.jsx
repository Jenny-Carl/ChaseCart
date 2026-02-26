import React from "react";
import { cn } from "@/lib/utils"; // si tu veux utiliser la fonction cn pour classNames

export const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseClasses = "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600";
  return (
    <button
      ref={ref}
      className={cn(baseClasses, className)}
      {...props}
    />
  );
});
