import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

type Color = "gray" | "white";

interface IProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  color?: Color;
  title: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

const Button: React.FC<IProps> = ({
  title,
  className,
  style,
  color = "gray",
  type = "button",
  loading,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={twMerge(
        "relative flex w-fit items-center px-14 py-4 text-2xl font-medium",
        clsx({
          "bg-darkGray text-primary": color === "gray",
          "bg-primary text-darkGray": color === "white",
          "select-none opacity-50": loading,
          group: !loading,
        }),
        className,
      )}
      style={style}
    >
      {loading && (
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <span>{title}</span>
      <span
        className={clsx(
          "absolute left-0 top-0 h-full w-full border-0 transition-[border] group-hover:border-[8px]",
          {
            "border-primary": color === "gray",
            "border-darkGray": color === "white",
          },
        )}
      />
    </button>
  );
};

export default Button;
