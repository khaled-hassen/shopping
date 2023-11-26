import React from "react";
import Link from "next/link";
import { route } from "@/router";
import AccountIcon from "@/components/icons/AccountIcon";
import SecurityIcon from "@/components/icons/SecurityIcon";
import OrdersIcon from "@/components/icons/OrdersIcon";
import { usePathname } from "next/navigation";
import SettingsIcon from "@/components/icons/SettingsIcon";
import PaymentIcon from "@/components/icons/PaymentIcon";
import ProductsIcon from "@/components/icons/ProductsIcon";

interface IProps {}

const pages = [
  { name: "Products", path: route("userStore"), Icon: ProductsIcon },
  { name: "Payment", path: route("userStorePayment"), Icon: PaymentIcon },
  { name: "Orders", path: route("userStoreOrders"), Icon: OrdersIcon },
  { name: "Settings", path: route("userStoreSettings"), Icon: SettingsIcon },
];

const StoreDetailsNavigation: React.FC<IProps> = ({}) => {
  const pathname = usePathname();

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
    </div>
  );
};

export default StoreDetailsNavigation;
