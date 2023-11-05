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
        "group relative block w-fit px-14 py-4 text-2xl font-medium",
        clsx({
          "bg-darkGray text-primary": color === "gray",
          "bg-primary text-darkGray": color === "white",
        }),
        className,
      )}
      style={style}
    >
      <span>{title}</span>
      <span
        className={clsx(
          "absolute left-0 top-0 h-full w-full border-0 transition-[border] group-hover:border-[8px]",
          {
            "border-primary": color === "gray",
            "border-darkGray": color === "white",
          },
        )}
      ></span>
    </Link>
  );
};

export default LinkButton;
