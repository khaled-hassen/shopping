import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const OutlinedStarIcon: React.FC<IconProps> = ({ size, thickness }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "36"}
      height={size ?? "36"}
      viewBox="0 0 36 37"
      fill="none"
    >
      <path
        d="M18 3.5L22.635 12.89L33 14.405L25.5 21.71L27.27 32.03L18 27.155L8.73 32.03L10.5 21.71L3 14.405L13.365 12.89L18 3.5Z"
        stroke="black"
        strokeWidth={thickness ?? "1.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OutlinedStarIcon;
