import React from "react";
import OutlinedStarIcon from "@/components/icons/OutlinedStarIcon";
import FilledStarIcon from "@/components/icons/FilledStarIcon";

type Props = {
  avgRating: number;
  starSize?: number;
};

const ProductReviewStars: React.FC<Props> = ({ starSize, avgRating }) => {
  return (
    <div className="relative w-fit">
      <div className="flex w-fit items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <OutlinedStarIcon key={i} size={starSize} />
        ))}
      </div>
      <div
        className="absolute left-0 top-0 flex w-fit items-center"
        style={{ clipPath: `inset(0 ${100 - (avgRating / 5) * 100}% 0 0)` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <FilledStarIcon key={i} size={starSize} />
        ))}
      </div>
    </div>
  );
};

export default ProductReviewStars;
