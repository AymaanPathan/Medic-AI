import React from "react";
import type { InputProps } from "../../types/interfaces";

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
    {...props}
  />
);

export default Input;
