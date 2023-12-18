import { withAuth } from "next-auth/middleware";
import { getUserPreferLang } from "~/libs/lang/server.lang";
import { NextResponse } from "next/server";
import { isPathHasLang } from "~/libs/lang/helper";

const PUBLIC_PAGES = ["/[lang]", "/[lang]/sign-in*", "/[lang]/sign-up*"];

export default withAuth(
  (req) => {
    const userLang = getUserPreferLang();
    const path = req.nextUrl.pathname;
    const routerLang = isPathHasLang(path);

    // check if the path contains lang or not
    if (!routerLang.hasLang) {
      req.nextUrl.pathname = `/${userLang}${path}`;
      return NextResponse.redirect(req.nextUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        let path = req.nextUrl.pathname || "/";
        const matchState = isPathHasLang(path);

        if (matchState.hasLang) {
          path = path.replace(new RegExp(`^\/${matchState.lang}`), "");
          path = path || "/"; // fallback
        }

        // check if path match the public page URL, if the config contains at the end *, it will match all the pages that start with the same path
        const isPublicPage = PUBLIC_PAGES.some((publicPath) => {
          let pathCompare = publicPath;
          if (pathCompare.startsWith("/[lang]")) {
            pathCompare = pathCompare.replace(/^\/\[lang]/, ``);
            pathCompare = pathCompare || "/"; // fallback
          }
          if (pathCompare.endsWith("*")) {
            pathCompare = pathCompare.replace(/\*$/, "");
            pathCompare = pathCompare || "/"; // fallback
            return path.startsWith(pathCompare);
          }
          return path === pathCompare;
        });

        if (isPublicPage) {
          return true;
        }
        return !!token;
      },
    },
  },
);
