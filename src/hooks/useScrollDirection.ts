import { useEffect } from "react";
import { useSignal } from "@preact/signals-react";

export enum ScrollDirection {
  Up = "Up",
  Down = "Down",
}

export function useScrollDirection() {
  const direction = useSignal<ScrollDirection>(ScrollDirection.Down);

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollDir() {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      direction.value =
        scrollY > lastScrollY ? ScrollDirection.Down : ScrollDirection.Up;
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [direction]);

  return direction.value;
}
