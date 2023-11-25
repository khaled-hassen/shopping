import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const PlusIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
    >
      <path
        d="M11 1.5V21.5M1 11.5H21"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
