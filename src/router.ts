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
  newStore: { path: "/store/new", access: Access.Authenticated },
  userStore: { path: "/store", access: Access.Authenticated },
  userStorePayment: { path: "/store/payment", access: Access.Authenticated },
  userStoreOrders: { path: "/store/orders", access: Access.Authenticated },
  userStoreSettings: { path: "/store/settings", access: Access.Authenticated },
  userStoreNewProduct: {
    path: "/store/products/new",
    access: Access.Authenticated,
  },
  userStoreEditProduct: {
    path: "/store/products/:slug/edit",
    access: Access.Authenticated,
  },
  userStorePreviewProduct: {
    path: "/store/products/:slug",
    access: Access.Authenticated,
  },
  product: {
    path: "/products/:slug",
    access: Access.Public,
  },
  store: {
    path: "/stores/:slug",
    access: Access.Public,
  },
  paymentFailed: {
    path: "/payment/failed",
    access: Access.Authenticated,
  },
  paymentSuccess: {
    path: "/payment/success",
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
