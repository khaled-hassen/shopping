import { useSession } from "@/hooks/useSession";
import { route } from "@/router";
import { useRouter } from "next/router";
import {
  Cart,
  useAddProductToCartMutation,
  useRemoveProductFromCartMutation,
} from "@/__generated__/client";
import { signal } from "@preact/signals-react";
import { useEffect } from "react";

const isCartOpen = signal(false);
const cart = signal<Cart>({ items: [], total: 0 });
const cartItemsNumber = signal(0);

export function useCart() {
  const { session, update } = useSession();
  const router = useRouter();
  const [addToCart, { loading: addToCartLoading }] =
    useAddProductToCartMutation();
  const [removeFromCart, { loading: removeFromCartLoading }] =
    useRemoveProductFromCartMutation();

  useEffect(() => {
    cart.value = session?.user?.cart || { items: [], total: 0 };
    cartItemsNumber.value = session?.user?.cart?.items.length || 0;
  }, [session]);

  async function addProductToCart(productId: string) {
    if (!session) {
      await router.push(
        route("login") + `?callback=${encodeURIComponent(router.pathname)}`,
      );
      return false;
    }

    const { data } = await addToCart({ variables: { productId } });
    if (!data?.addProductToCart?.cartProduct) return false;

    const cart = session.user.cart || { items: [], total: 0 };
    const quantity =
      cart.items.find((item) => item.product.id === productId)?.quantity || 0;
    const price = data.addProductToCart.cartProduct.price;
    const discount = data.addProductToCart.cartProduct.discount;

    const item = cart.items.find((item) => item.product.id === productId);
    if (item) item.quantity += 1;
    else
      cart.items.push({
        product: data.addProductToCart.cartProduct,
        quantity: quantity + 1,
      });

    cart.total += price - price * (discount ?? 0);
    await update({ user: { cart } });
    return true;
  }

  async function removeProductFromCart(productId: string) {
    if (!session) {
      await router.push(
        route("login") + `?callback=${encodeURIComponent(router.pathname)}`,
      );
      return false;
    }

    const { data } = await removeFromCart({ variables: { productId } });
    if (!data?.removeProductFromCart?.cartProduct) return false;

    const cart = session.user.cart || { items: [], total: 0 };
    const price = data.removeProductFromCart.cartProduct.price;
    const discount = data.removeProductFromCart.cartProduct.discount;
    cart.total -= price - price * (discount ?? 0);

    const item = cart.items.find((item) => item.product.id === productId);
    if (item) item.quantity -= 1;
    cart.items = cart.items.filter((item) => item.quantity > 0);

    await update({ user: { cart } });
    return true;
  }

  function isInCart(productId: string) {
    if (!session) return false;
    return !!session.user.cart?.items.find(
      (item) => item.product.id === productId,
    )?.quantity;
  }

  function openCart() {
    isCartOpen.value = true;
  }

  function closeCart() {
    isCartOpen.value = false;
  }

  return {
    cartItemsNumber,
    addToCartLoading,
    removeFromCartLoading,
    isCartOpen,
    cart,
    isInCart,
    addProductToCart,
    removeProductFromCart,
    openCart,
    closeCart,
  };
}
