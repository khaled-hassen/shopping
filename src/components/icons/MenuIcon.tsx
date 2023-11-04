import React from "react";
import { IconProps } from "@/components/icons/IconProps";

interface IProps extends IconProps {
  active?: boolean;
}

const MenuIcon: React.FC<IProps> = ({ active }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-active={active}
      className="group"
    >
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className="origin-left scale-x-[60%] transition-transform group-hover:scale-x-100 group-data-[active=true]:scale-x-100"
      />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className="origin-right scale-x-[60%] transition-transform group-hover:scale-x-100 group-data-[active=true]:scale-x-100"
      />
    </svg>
  );
};

export default MenuIcon;
