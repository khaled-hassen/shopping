export const openSidebar = () => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
};

export const closeSidebar = () => {
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
};

export const toggleSidebar = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
};

export function asset(path: string) {
  if (!path) return "";
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const parsedToken = JSON.parse(token);
  const expires = new Date(parsedToken.expires).getTime();
  if (Date.now() >= expires) return null;
  return parsedToken.value as string;
}

export function setToken(value: string, expires: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", JSON.stringify({ value, expires }));
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}
