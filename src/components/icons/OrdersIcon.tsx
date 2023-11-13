import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const OrdersIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="21"
      viewBox="0 0 16 21"
      fill="none"
    >
      <path
        d="M15 19.5L8 14.5L1 19.5V3.5C1 2.96957 1.21071 2.46086 1.58579 2.08579C1.96086 1.71071 2.46957 1.5 3 1.5H13C13.5304 1.5 14.0391 1.71071 14.4142 2.08579C14.7893 2.46086 15 2.96957 15 3.5V19.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OrdersIcon;
