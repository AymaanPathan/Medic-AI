import React from "react";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
} from "../../types/interfaces";

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur shadow-xl ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
}) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
}) => <p className="text-sm text-gray-400">{children}</p>;

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
