import "server-only";
import { type SupportLang } from "~/libs/lang/types";

export type Dictionary = {
  [key in string]: string | Dictionary | undefined;
};

const dictionaries = {
  en: () => import("~/i18n/en.json").then((module) => module.default),
  vi: () => import("~/i18n/vi.json").then((module) => module.default),
} as {
  [key in SupportLang]: () => Promise<Dictionary | undefined>;
};

export const getDictionary = async (locale: SupportLang) =>
  dictionaries[locale]();
