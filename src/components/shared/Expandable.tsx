import React, { useEffect, useRef } from "react";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { useSignal } from "@preact/signals-react";
import { clsx } from "clsx";

interface IProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Expandable: React.FC<IProps> = ({
  title,
  defaultOpen = false,
  children,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const open = useSignal(defaultOpen);

  function toggle() {
    if (!container.current) return;
    const el = container.current;
    el.style.height = open.value ? "0" : `${el.scrollHeight}px`;
    open.value = !open.value;
  }

  useEffect(toggle, [defaultOpen]);

  return (
    <div className="flex flex-col gap-4">
      <button className="flex items-center gap-8" onClick={toggle}>
        <span className="text-4xl font-bold">{title}</span>
        <ChevronIcon
          size={40}
          className={clsx(
            "transition-transform",
            open.value ? "-rotate-90" : "rotate-90",
          )}
        />
      </button>
      <div ref={container} className="overflow-hidden transition-[height]">
        {children}
      </div>
    </div>
  );
};

export default Expandable;
