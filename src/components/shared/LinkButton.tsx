import React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { clsx } from "clsx";

type Color = "gray" | "white";

interface IProps {
  className?: string;
  color?: Color;
  title: string;
  href: string;
  style?: React.CSSProperties;
}

const LinkButton: React.FC<IProps> = ({
  title,
  href,
  className,
  style,
  color = "gray",
}) => {
  return (
    <Link
      href={href}
      role="button"
      className={twMerge(
        "block w-fit px-14 py-4 text-2xl font-medium",
        clsx({
          "bg-dark-gray text-primary": color === "gray",
          "bg-primary text-dark-gray": color === "white",
        }),
        className,
      )}
      style={style}
    >
      <span>{title}</span>
    </Link>
  );
};

export default LinkButton;
