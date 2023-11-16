enum Access {
  Public,
  Authenticated,
  NotAuthenticated,
}

const routes = {
  home: { path: "/", access: Access.Public },
  categories: { path: "/categories", access: Access.Public },
  latest: { path: "/latest", access: Access.Public },
  login: { path: "/login", access: Access.NotAuthenticated },
  register: { path: "/register", access: Access.NotAuthenticated },
  category: { path: "/categories/:slug", access: Access.Public },
  products: { path: "/:slug/products", access: Access.Public },
  account: { path: "/account", access: Access.Authenticated },
  security: { path: "/account/security", access: Access.Authenticated },
  billing: { path: "/account/billing", access: Access.Authenticated },
  orders: { path: "/account/orders", access: Access.Authenticated },
  wishlist: { path: "/account/wishlist", access: Access.Authenticated },
  store: { path: "/account/store", access: Access.Authenticated },
  verificationEmailSent: {
    path: "/verification-email-sent",
    access: Access.NotAuthenticated,
  },
};

type Route = keyof typeof routes;

export function route(route: Route, slug?: string) {
  return routes[route].path.replace(":slug", slug || "");
}

export const protectedRoutes = Object.entries(routes).filter(
  ([_, route]) => route.access === Access.Authenticated,
);

export const unProtectedRoutes = Object.entries(routes).filter(
  ([_, route]) => route.access === Access.NotAuthenticated,
);
