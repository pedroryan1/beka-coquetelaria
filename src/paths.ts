const base = import.meta.env.BASE_URL;
const usesHashRoutes = base !== '/';

// Project sites on GitHub Pages live below /repository/ and have no SPA fallback.
// Keep the existing clean URLs when deployed at the domain root.
export function routeHref(to:string):string {
 return usesHashRoutes ? `${base}#${to}` : to;
}

export function currentRoute():string {
 return usesHashRoutes ? (location.hash.startsWith('#/') ? location.hash.slice(1).split('?')[0] : '/') : location.pathname;
}

export function routeSearch():string {
 return usesHashRoutes ? location.hash.slice(location.hash.indexOf('?') >= 0 ? location.hash.indexOf('?') : location.hash.length) : location.search;
}

export function assetUrl(source:string):string {
 if(!source.startsWith('/') || base === '/' || source.startsWith(base))return source;
 return base + source.slice(1);
}

export function absoluteRoute(to:string):string {
 return new URL(routeHref(to),location.origin).href;
}
