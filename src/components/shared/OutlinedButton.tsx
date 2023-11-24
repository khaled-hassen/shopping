import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface IProps {
  type?: "button" | "submit" | "reset";
  className?: string;

  title: string;
  style?: React.CSSProperties;
  loading?: boolean;
  disabled?: boolean;
  onClick?(): void;
}

const OutlinedButton: React.FC<IProps> = ({
  title,
  className,
  style,
  type = "button",
  loading,
  disabled,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={twMerge(
        "flex w-fit items-center border-2 border-dark-gray bg-primary px-14 py-4 text-2xl font-medium text-dark-gray",
        clsx({
          "select-none opacity-50": loading || disabled,
        }),
        className,
      )}
      style={style}
      onClick={loading || disabled ? undefined : onClick}
    >
      {loading && (
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-dark-gray"
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
    </button>
  );
};

export default OutlinedButton;
