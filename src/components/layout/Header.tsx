import React from "react";
import { route } from "@/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";
import AccountIcon from "@/components/icons/AccountIcon";
import CartIcon from "@/components/icons/CartIcon";
import { useSignal } from "@preact/signals-react";
import MenuIcon from "@/components/icons/MenuIcon";
import MobileMenu from "@/components/layout/MobileMenu";
import {
  ScrollDirection,
  useScrollDirection,
} from "@/hooks/useScrollDirection";
import { clsx } from "clsx";
import { useSession } from "next-auth/react";

interface IProps {}

const pages = [
  { name: "Home", path: route("home") },
  { name: "Categories", path: route("categories") },
  { name: "Latest", path: route("latest") },
];

const Header: React.FC<IProps> = ({}) => {
  const pathname = usePathname();
  const showMobileMenu = useSignal(false);
  const direction = useScrollDirection();
  const { data: session } = useSession();

  return (
    <header
      className={clsx(
        "sticky z-10 transition-[top] duration-300",
        direction === ScrollDirection.Down ? "-top-full" : "top-0",
      )}
    >
      <div className="page-x-padding relative z-[51] grid grid-cols-2 items-center gap-8 border-b border-black border-opacity-20 bg-primary py-6 transition-[padding] md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => (showMobileMenu.value = !showMobileMenu.value)}
          >
            <MenuIcon active={showMobileMenu.value} />
          </button>
          <Link
            href={route("home")}
            className="text-xl font-medium xs:text-2xl"
          >
            OneStopMALL
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              data-active={pathname === page.path}
              className="group flex flex-col items-start text-xl"
            >
              <span className="group-data-[active=true]:uppercase">
                {page.name}
              </span>
              <span className="h-0.5 w-[80%] origin-left scale-x-0 bg-black transition-transform duration-300 ease-in-out group-hover:scale-x-100 group-data-[active=true]:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex h-full items-center justify-end gap-6">
          <button className="">
            <SearchIcon />
          </button>
          <div className="h-full w-0.5 bg-black/20" />
          <div className="flex items-center gap-6">
            <Link
              href={route(session ? "account" : "login")}
              className="hidden items-center gap-4 xs:flex"
            >
              <AccountIcon />
              <span className="hidden text-xl lg:block">Account</span>
            </Link>
            <button className="flex items-center gap-4">
              <CartIcon />
              <span className="hidden text-xl lg:block">Cart</span>
            </button>
          </div>
        </div>
      </div>
      <MobileMenu
        pages={pages}
        show={showMobileMenu.value}
        onClose={() => (showMobileMenu.value = false)}
      />
    </header>
  );
};

export default Header;
