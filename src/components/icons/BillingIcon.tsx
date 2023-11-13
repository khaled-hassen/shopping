import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const BillingIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="19"
      viewBox="0 0 24 19"
      fill="none"
    >
      <path
        d="M1 7.5H23M3 1.5H21C22.1046 1.5 23 2.39543 23 3.5V15.5C23 16.6046 22.1046 17.5 21 17.5H3C1.89543 17.5 1 16.6046 1 15.5V3.5C1 2.39543 1.89543 1.5 3 1.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BillingIcon;
