import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "navy" | "smoke" | "warning";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full";

  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-headline",
    navy: "bg-primary text-white",
    smoke: "bg-smoke text-body",
    warning: "bg-yellow text-headline",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
