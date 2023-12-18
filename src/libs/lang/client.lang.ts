import { type SupportLang } from "~/libs/lang/types";
import Cookies from "js-cookie";
import { COOKIE_LANG_KEY, getNewExpireCookieLang } from "~/libs/lang/helper";

const setClientLang = (lang: SupportLang) => {
  Cookies.set(COOKIE_LANG_KEY, lang, {
    expires: getNewExpireCookieLang(),
    sameSite: "strict",
  });
};

const getClientLang = () => {
  return Cookies.get(COOKIE_LANG_KEY) as SupportLang | undefined;
};

export const clientLang = {
  set: setClientLang,
  get: getClientLang,
};
