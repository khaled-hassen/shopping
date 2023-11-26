import React from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { ProductResult } from "@/__generated__/ssr";
import { asset } from "@/utils/assets";
import { route } from "@/router";

interface IProps {
  product: ProductResult;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  return (
    <div className="children:transition-all children:duration-300">
      <Link
        href={route("product", product.id)}
        className="group relative flex h-[26rem] origin-top flex-col items-center border border-dark-gray border-opacity-20 bg-primary p-10 hover:z-[1] hover:scale-y-105 hover:shadow-2xl"
      >
        <div className="absolute left-1/2 top-0 h-1 w-52 origin-top -translate-x-1/2 scale-y-0 bg-dark-gray group-hover:scale-y-100" />
        <OptimizedImage
          src={asset(product.coverImage)}
          alt={product.name}
          className="h-60 w-full mix-blend-darken group-hover:h-48"
        />
        <div className="-mb-10 grid flex-1 place-content-center group-hover:mb-6">
          <p className="max-w-[14rem] text-center text-3xl">{product.name}</p>
        </div>
        <div className="absolute bottom-0 left-1/2 flex w-52 origin-bottom -translate-x-1/2 scale-y-0 flex-col group-hover:scale-y-100">
          <button className="border border-b-0 border-dark-gray border-opacity-20 bg-primary p-4">
            <span className="text-2xl font-medium">Browse</span>
          </button>
          <div className="h-1 bg-dark-gray" />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
