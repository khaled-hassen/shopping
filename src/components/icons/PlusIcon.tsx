import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const PlusIcon: React.FC<IconProps> = ({ size, thickness }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "22"}
      height={size ?? "22"}
      viewBox="0 0 22 23"
      fill="none"
    >
      <path
        d="M11 1.5V21.5M1 11.5H21"
        stroke="black"
        strokeWidth={thickness ?? "1.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
