import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "@/router";
import AccountIcon from "@/components/icons/AccountIcon";
import { useClickAway } from "@/hooks/useClickAway";

interface IProps {
  show: boolean;
  pages: { name: string; path: string }[];
  onClose(): void;
}

const MobileMenu: React.FC<IProps> = ({ show, pages, onClose }) => {
  const pathname = usePathname();
  const ref = useClickAway<HTMLDivElement>(onClose);

  return (
    <div
      ref={ref}
      data-show={show}
      className="absolute left-0 top-full z-50 w-full origin-top -translate-y-full border-b border-black border-opacity-20 bg-primary py-10 transition-transform data-[show=true]:translate-y-0 md:hidden"
    >
      <nav className="flex flex-col items-center gap-4">
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            data-active={pathname === page.path}
            className="group flex flex-col items-start text-xl"
            onClick={onClose}
          >
            <span className="group-data-[active=true]:uppercase">
              {page.name}
            </span>
            <span className="h-0.5 w-[80%] origin-left scale-x-0 bg-black transition-transform duration-300 ease-in-out group-hover:scale-x-100 group-data-[active=true]:scale-x-100" />
          </Link>
        ))}
        <Link
          href={route("login")}
          className="flex items-center gap-4 xs:hidden"
        >
          <AccountIcon />
          <span className="text-xl">Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
