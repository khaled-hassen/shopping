import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const SecurityIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="23"
      viewBox="0 0 20 23"
      fill="none"
    >
      <path
        d="M5 10.5V6.5C5 5.17392 5.52678 3.90215 6.46447 2.96447C7.40215 2.02678 8.67392 1.5 10 1.5C11.3261 1.5 12.5979 2.02678 13.5355 2.96447C14.4732 3.90215 15 5.17392 15 6.5V10.5M3 10.5H17C18.1046 10.5 19 11.3954 19 12.5V19.5C19 20.6046 18.1046 21.5 17 21.5H3C1.89543 21.5 1 20.6046 1 19.5V12.5C1 11.3954 1.89543 10.5 3 10.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SecurityIcon;
