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
};

type Route = keyof typeof routes;

export function route(route: Route, slug?: string) {
  return routes[route].path.replace(":slug", slug || "");
}
