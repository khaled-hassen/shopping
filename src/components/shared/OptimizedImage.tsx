import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface IProps {
  src: string;
  alt?: string;
  className?: string;
}

const OptimizedImage: React.FC<IProps> = ({ src, alt, className }) => {
  return (
    <Image
      src={src}
      alt={alt || ""}
      height={0}
      width={0}
      sizes="100vw"
      className={twMerge("aspect-auto object-contain", className)}
    />
  );
};

export default OptimizedImage;
