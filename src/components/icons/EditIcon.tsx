import React from "react";
import { IconProps } from "@/components/icons/IconProps";

const EditIcon: React.FC<IconProps> = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
    >
      <path
        d="M16.1719 2.41424C16.4345 2.1516 16.7463 1.94326 17.0895 1.80112C17.4326 1.65897 17.8004 1.58582 18.1719 1.58582C18.5433 1.58582 18.9111 1.65897 19.2543 1.80112C19.5974 1.94326 19.9092 2.1516 20.1719 2.41424C20.4345 2.67689 20.6429 2.98869 20.785 3.33185C20.9271 3.67501 21.0003 4.04281 21.0003 4.41424C21.0003 4.78568 20.9271 5.15347 20.785 5.49663C20.6429 5.8398 20.4345 6.1516 20.1719 6.41424L6.67188 19.9142L1.17188 21.4142L2.67188 15.9142L16.1719 2.41424Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIcon;
