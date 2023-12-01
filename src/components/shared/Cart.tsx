import React from "react";
import SidebarContainer from "@/components/shared/SidebarContainer";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/shared/Button";
import { Format } from "@/utils/format";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { useCheckoutMutation } from "@/__generated__/client";
import { useRouter } from "next/navigation";

type Props = {};

const Cart: React.FC<Props> = ({}) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    addProductToCart,
    removeProductFromCart,
  } = useCart();

  const router = useRouter();
  const [checkout, { data, loading, reset }] = useCheckoutMutation({
    onCompleted({ checkout: { redirectUrl } }) {
      if (redirectUrl) router.push(redirectUrl);
    },
  });

  return (
    <SidebarContainer
      title="Cart"
      show={isCartOpen.value}
      onClose={() => {
        reset();
        closeCart();
      }}
    >
      <div className="flex flex-1 flex-col overflow-auto">
        {cart.value?.items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="grid grid-cols-[8rem_1fr] gap-4 border-b border-black border-opacity-20 bg-primary py-4 last-of-type:border-b-0 last-of-type:pb-0"
          >
            <OptimizedImage
              src={asset(product.coverImage)}
              alt={product.name}
              className="mx-auto h-24 w-auto max-w-full mix-blend-darken"
            />
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="">
                <p className="text-xl font-medium">{product.name}</p>
                <div className="flex items-center gap-4">
                  <button
                    className="h-6 focus:outline-0"
                    onClick={() => removeProductFromCart(product.id)}
                  >
                    <MinusIcon />
                  </button>
                  <p className="font-medium">{quantity}</p>
                  <button
                    className="h-6 focus:outline-0"
                    onClick={() => addProductToCart(product.id)}
                  >
                    <PlusIcon size={14} thickness={2} />
                  </button>
                </div>
              </div>
              <p className="text-xl">
                {Format.currency(
                  product.price * (1 - (product.discount ?? 0)) * quantity,
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-6 border-t border-black border-opacity-20 pt-4">
        {data?.checkout.errors?.map((error) => (
          <p key={error.message} className="font-medium text-danger">
            {error.message}
          </p>
        ))}
        <p className="text-2xl">
          <span className="font-bold">Total: </span>
          <span className="">{Format.currency(cart.value?.total)}</span>
        </p>
        <Button
          title="Checkout"
          className="w-full"
          disabled={cart.value.items.length === 0}
          loading={loading}
          onClick={checkout}
        />
      </div>
    </SidebarContainer>
  );
};

export default Cart;
