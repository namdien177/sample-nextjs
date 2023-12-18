import ky, { type Options } from "ky";
import { env } from "~/env";
import { getUserPreferLang } from "~/libs/lang/server.lang";
import { auth } from "~/server/auth";

const kyInstance = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
});

/**
 * Ky instance to query as server-internal calls
 * @param withAuthorization - whether to include `Authorization` header or not. Default to `true`
 */
const getKyServer = async (withAuthorization = true) => {
  const locale = getUserPreferLang();
  const defaultHeader: Options["headers"] = {};
  if (withAuthorization) {
    // try to get token from auth()
    const session = await auth();
    if (session?.user.token) {
      defaultHeader.Authorization = `Bearer ${session.user.token}`;
    }
  }

  return kyInstance.extend({
    headers: defaultHeader,
    searchParams: { locale },
  });
};

export default getKyServer;
