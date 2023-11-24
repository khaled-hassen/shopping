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
  verificationEmailSent: {
    path: "/verification-email-sent",
    access: Access.NotAuthenticated,
  },
  verifyEmail: {
    path: "/verify-email",
    access: Access.NotAuthenticated,
  },
  forgotPassword: {
    path: "/forgot-password",
    access: Access.NotAuthenticated,
  },
  resetPassword: {
    path: "/reset-password",
    access: Access.NotAuthenticated,
  },
  store: { path: "/store", access: Access.Authenticated },
  storePayment: { path: "/store/payment", access: Access.Authenticated },
  storeOrders: { path: "/store/orders", access: Access.Authenticated },
  storeSettings: { path: "/store/settings", access: Access.Authenticated },
  storeNewProduct: {
    path: "/store/products/new",
    access: Access.Authenticated,
  },
  storeEditProduct: {
    path: "/store/products/:slug",
    access: Access.Authenticated,
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
