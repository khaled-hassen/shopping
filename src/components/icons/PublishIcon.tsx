import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const PublishIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M21 1L10 12M21 1L14 21L10 12M21 1L1 8L10 12"
        stroke="#219C90"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PublishIcon;
