import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const PaymentIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="25"
      viewBox="0 0 14 25"
      fill="none"
    >
      <path
        d="M7 1.5V23.5M12 5.5H4.5C3.57174 5.5 2.6815 5.86875 2.02513 6.52513C1.36875 7.1815 1 8.07174 1 9C1 9.92826 1.36875 10.8185 2.02513 11.4749C2.6815 12.1313 3.57174 12.5 4.5 12.5H9.5C10.4283 12.5 11.3185 12.8687 11.9749 13.5251C12.6313 14.1815 13 15.0717 13 16C13 16.9283 12.6313 17.8185 11.9749 18.4749C11.3185 19.1313 10.4283 19.5 9.5 19.5H1"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PaymentIcon;
