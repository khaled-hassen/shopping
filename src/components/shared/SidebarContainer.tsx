import React, { useEffect } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import { CSSTransition } from "react-transition-group";

type Props = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  show: boolean;
  onClose(): void;
};

const SidebarContainer: React.FC<Props> = ({
  title,
  children,
  show,
  onClose,
}) => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [show]);

  return (
    <>
      <CSSTransition in={show} timeout={300} classNames="fade" unmountOnExit>
        <div
          className="fixed left-0 top-0 z-[999999] h-full w-full bg-dark-gray/50"
          onClick={onClose}
        />
      </CSSTransition>
      <CSSTransition in={show} timeout={300} classNames="slide" unmountOnExit>
        <div className="fixed right-0 top-0 z-[9999999] h-full w-[30rem] max-w-full bg-primary p-6">
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between gap-10 border-b border-black border-opacity-20 bg-primary pb-4">
              <p className="text-4xl font-medium">{title}</p>
              <button onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            {children}
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default SidebarContainer;
