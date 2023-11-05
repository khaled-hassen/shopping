import { useEffect, useRef } from "react";

export function useClickAway<T extends HTMLElement>(action: Function) {
  const target = useRef<T>(null);

  useEffect(() => {
    function handleClick(evt: MouseEvent) {
      if (target.current && !target.current.contains(evt.target as Node)) {
        action();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [action, target]);

  return target;
}
