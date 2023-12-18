import { type ObjectValue } from "~/libs/typings";

export const SUPPORT_LANG = {
  VI: "vi",
  EN: "en",
} as const;

export type SupportLang = ObjectValue<typeof SUPPORT_LANG>;
