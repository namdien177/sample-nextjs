import "server-only";

import { COOKIE_LANG_KEY } from "~/libs/lang/helper";
import { cookies } from "next/headers";
import { SUPPORT_LANG, type SupportLang } from "~/libs/lang/types";

export const getLangFromCookies = () => {
  return cookies().get(COOKIE_LANG_KEY)?.value as SupportLang | undefined;
};

export const getUserPreferLang = () => {
  // set default lang to VN
  let lang: SupportLang = SUPPORT_LANG.EN;

  // get lang from cookies
  const cookiesLang = getLangFromCookies();
  if (cookiesLang) {
    lang = cookiesLang;
  }
  return lang;
};
