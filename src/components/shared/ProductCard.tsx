import React from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { ProductResult, PublicStore } from "@/__generated__/ssr";
import { asset } from "@/utils/assets";
import { route } from "@/router";
import { Format } from "@/utils/format";
import { useCart } from "@/hooks/useCart";

interface IProps {
  product: ProductResult;
  store: PublicStore;
}

const ProductCard: React.FC<IProps> = ({ product, store }) => {
  const { addProductToCart, isInCart, openCart } = useCart();

  function calculatePrice(price: number, discount?: number | null) {
    return Format.currency(price - price * (discount || 0));
  }

  return (
    <div className="group relative flex h-[29rem] flex-col items-center overflow-hidden border border-dark-gray border-opacity-20 bg-primary p-4 pb-0 xs:p-10">
      {!!product.discount && (
        <p className="absolute left-0 top-0 bg-warning px-1 py-0.5 text-sm">
          Save {Format.percent(product.discount)}
        </p>
      )}

      <div className="flex flex-1  flex-col items-center gap-10 transition-all group-hover:mb-[0.85rem] group-hover:gap-4 touch-screen:gap-4">
        <Link href={route("product", product.id)}>
          <OptimizedImage
            src={asset(product.coverImage)}
            alt={product.name}
            className="h-60 w-full mix-blend-darken"
          />
        </Link>
        <div className="flex flex-col items-center">
          <Link
            href={route("product", product.id)}
            className="text-center text-2xl font-medium"
          >
            {product.name}
          </Link>
          <Link
            href={route("store", store.id)}
            className="text-center font-medium"
          >
            {store.name}
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-xl font-medium">
              {calculatePrice(product.price, product.discount)}
            </p>
            {!!product.discount && (
              <p className="text-sm line-through opacity-50">
                {Format.currency(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-[-1px] flex translate-y-full flex-col transition-transform group-hover:translate-y-0 touch-screen:translate-y-0">
        <button
          className="border border-b-0 border-dark-gray border-opacity-20 bg-primary px-20 py-4"
          onClick={() =>
            isInCart(product?.id || "")
              ? openCart()
              : addProductToCart(product?.id || "")
          }
        >
          <span className="text-2xl font-medium">
            {isInCart(product?.id || "") ? "View in cart" : "Add to cart"}
          </span>
        </button>
        <div className="h-1 bg-dark-gray" />
      </div>
    </div>
  );
};

export default ProductCard;
