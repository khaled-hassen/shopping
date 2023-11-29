import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const MinusIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="3"
      viewBox="0 0 14 3"
      fill="none"
    >
      <path
        d="M1 1.5H13"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MinusIcon;
