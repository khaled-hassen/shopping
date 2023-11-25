import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const ChevronIcon: React.FC<IconProps> = ({ className, size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "24"}
      height={size ?? "24"}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronIcon;
