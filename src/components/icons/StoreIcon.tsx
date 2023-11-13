import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const StoreIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
    >
      <path
        d="M0.902344 1H4.90234L7.58234 14.39C7.67379 14.8504 7.92425 15.264 8.28989 15.5583C8.65553 15.8526 9.11304 16.009 9.58234 16H19.3023C19.7716 16.009 20.2292 15.8526 20.5948 15.5583C20.9604 15.264 21.2109 14.8504 21.3023 14.39L22.9023 6H5.90234M9.90234 21C9.90234 21.5523 9.45463 22 8.90234 22C8.35006 22 7.90234 21.5523 7.90234 21C7.90234 20.4477 8.35006 20 8.90234 20C9.45463 20 9.90234 20.4477 9.90234 21ZM20.9023 21C20.9023 21.5523 20.4546 22 19.9023 22C19.3501 22 18.9023 21.5523 18.9023 21C18.9023 20.4477 19.3501 20 19.9023 20C20.4546 20 20.9023 20.4477 20.9023 21Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StoreIcon;
