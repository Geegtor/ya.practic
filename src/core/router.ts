import Block from "./base/block";
import { Route } from "./route"


export class RouterClass {
  static __instance: RouterClass;
  private routes: Route[] = [];
  private history = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = "";

  constructor(rootQuery: string) {
    if (RouterClass.__instance) {
      return RouterClass.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    RouterClass.__instance = this;
  }

  getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname)) ?? null;
  }

  use(pathname: string, block: typeof  Block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = () => {
      this._onRoute(document.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route?.render(this.history.state);
  }

  go(pathname: string, state: Record<string, unknown> = {}) {
    this.history.pushState(state, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }
}

const router = new RouterClass("app");

export { router as Router }
