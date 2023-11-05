import { Maybe } from "graphql/jsutils/Maybe";

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
  category: { path: "/categories/:id", access: Access.Public },
};

type Route = keyof typeof routes;

export function route(route: Route, id?: string | Maybe<string>) {
  return routes[route].path.replace(":id", id || "");
}
