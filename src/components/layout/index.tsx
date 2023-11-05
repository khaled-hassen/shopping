import React from "react";
import Header from "@/components/layout/Header";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <div className="animate-reveal flex min-h-screen flex-col">
      <Header />
      <main className="page-x-padding flex-1 bg-primary pb-20 transition-[padding]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
