import React from "react";
import { signOut } from "next-auth/react";
import { useLogoutMutation } from "@/__generated__/client";
import Link from "next/link";
import { route } from "@/router";
import AccountIcon from "@/components/icons/AccountIcon";
import SecurityIcon from "@/components/icons/SecurityIcon";
import BillingIcon from "@/components/icons/BillingIcon";
import OrdersIcon from "@/components/icons/OrdersIcon";
import WishlistIcon from "@/components/icons/WishlistIcon";
import StoreIcon from "@/components/icons/StoreIcon";
import { usePathname } from "next/navigation";
import LogoutIcon from "@/components/icons/LogoutIcon";

interface IProps {}

const pages = [
  { name: "Personal information", path: route("account"), Icon: AccountIcon },
  { name: "Security", path: route("security"), Icon: SecurityIcon },
  { name: "Billing", path: route("billing"), Icon: BillingIcon },
  { name: "Orders", path: route("orders"), Icon: OrdersIcon },
  { name: "Wishlist", path: route("wishlist"), Icon: WishlistIcon },
  { name: "Store", path: route("userStore"), Icon: StoreIcon },
];

const AccountPageHeader: React.FC<IProps> = ({}) => {
  const pathname = usePathname();
  const [logout] = useLogoutMutation();

  async function logoutUser() {
    await logout();
    await signOut();
  }

  return (
    <div className="flex flex-col-reverse items-end justify-between gap-10 xs:flex-row xs:items-start">
      <div className="flex w-full flex-col gap-10  border border-dark-gray p-4 xs:w-fit xs:flex-row xs:flex-wrap xs:items-center">
        {pages.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            data-active={pathname === item.path}
            className="group flex items-center gap-4 text-xl"
          >
            <div className="grid h-full place-content-center">
              <item.Icon />
            </div>
            <div className="flex w-fit flex-col">
              <span className="group-data-[active=true]:uppercase">
                {item.name}
              </span>
              <span className="h-0.5 w-[70%] max-w-[4rem] origin-left scale-x-0 bg-black transition-transform duration-300 ease-in-out group-hover:scale-x-100 group-data-[active=true]:scale-x-100" />
            </div>
          </Link>
        ))}
      </div>
      <button
        className="group flex items-center gap-4 border border-dark-gray p-4 text-xl"
        onClick={logoutUser}
      >
        <div className="grid h-full place-content-center">
          <LogoutIcon />
        </div>
        <div className="flex w-fit flex-col">
          <span className="">Logout</span>
          <span className="h-0.5 w-[80%] origin-left scale-x-0 bg-black transition-transform duration-300 ease-in-out group-hover:scale-x-100 group-data-[active=true]:scale-x-100" />
        </div>
      </button>
    </div>
  );
};

export default AccountPageHeader;
