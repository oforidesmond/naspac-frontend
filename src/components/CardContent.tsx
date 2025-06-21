// src/components/ui/CardContent.tsx
import React from "react";

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`p-4 sm:p-6 md:p-8 ${className}`}>{children}</div>;
};

export default CardContent;