import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "navy" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none font-title";

  const variants = {
    primary: "bg-[#6b0014] text-white hover:bg-[#850019] shadow-md hover:shadow-lg border border-white/10",
    secondary: "bg-[#ffc000] text-[#1C1C1C] hover:bg-[#e6ac00] shadow-md hover:shadow-lg font-extrabold",
    navy: "bg-[#6b0014] text-white hover:bg-[#850019] shadow-md hover:shadow-lg",
    outline: "border-2 border-white text-white hover:bg-white hover:text-[#6b0014] shadow-sm",
    ghost: "bg-transparent text-[#505050] hover:text-[#6b0014] hover:bg-[#F7F7F7]",
    gold: "bg-gradient-to-r from-[#ffc000] to-[#ffd033] text-[#1C1C1C] hover:brightness-105 shadow-md hover:shadow-xl font-extrabold",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs md:text-sm",
    md: "px-6 py-3 text-sm md:text-base",
    lg: "px-8 py-4 text-base md:text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
