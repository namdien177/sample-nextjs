import { SUPPORT_LANG, type SupportLang } from "~/libs/lang/types";

export const COOKIE_LANG_KEY = "NEXT_LOCALE";

export const getNewExpireCookieLang = () => {
  const tobeExpire = new Date();
  // Set the date object to 1 year ahead
  tobeExpire.setFullYear(tobeExpire.getFullYear() + 1);
  return tobeExpire;
};

export const isPathHasLang = (path: string) => {
  let matchingLang: SupportLang | undefined;
  const isMatched = Object.values(SUPPORT_LANG).some((tokenLocale) => {
    const match =
      path.startsWith(`/${tokenLocale}/`) || path === `/${tokenLocale}`;
    if (match) {
      matchingLang = tokenLocale;
    }
    return match;
  });

  return {
    hasLang: isMatched,
    lang: matchingLang,
  } as { hasLang: false } | { hasLang: true; lang: SupportLang };
};
