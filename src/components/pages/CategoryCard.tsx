import React from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

interface IProps {
  image: { src: string; alt: string };
  title: string;
  link: string;
}

const CategoryCard: React.FC<IProps> = ({ title, image, link }) => {
  return (
    <div className="children:transition-all children:duration-300">
      <Link
        href={link}
        className="group relative flex h-[26rem] origin-top flex-col items-center border border-darkGray border-opacity-20 bg-primary p-10 hover:z-[1] hover:scale-y-105 hover:shadow-2xl"
      >
        <div className="absolute left-1/2 top-0 h-1 w-52 origin-top -translate-x-1/2 scale-y-0 bg-darkGray group-hover:scale-y-100" />
        <OptimizedImage
          {...image}
          className="h-60 w-full object-cover group-hover:h-48"
        />
        <div className="-mb-10 grid flex-1 place-content-center group-hover:mb-6">
          <p className="max-w-[14rem] text-center text-3xl">{title}</p>
        </div>
        <div className="absolute bottom-0 left-1/2 flex w-52 origin-bottom -translate-x-1/2 scale-y-0 flex-col group-hover:scale-y-100">
          <button className="border border-b-0 border-darkGray border-opacity-20 bg-primary p-4">
            <span className="text-2xl font-medium">Browse</span>
          </button>
          <div className="h-1 bg-darkGray" />
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
