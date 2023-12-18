import { auth } from "~/server/auth";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import SignOutButton from "~/components/next-auth/SignOutButton";
import { getDictionary } from "~/libs/i18n/dictionary";
import { type SupportLang } from "~/libs/lang/types";
import t from "~/libs/i18n/translate";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function HomePage({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang as SupportLang);
  const session = await auth();
  if (!session)
    return (
      <div className={"container mx-auto flex flex-col gap-4 p-8"}>
        <h1>{t("homepage-page.welcome-visitor", dictionary)}</h1>
        <p>{t("homepage-page.sign-in-suggestion", dictionary)}</p>
        <Link className={buttonVariants()} href={`/${lang}/sign-in`}>
          Login
        </Link>
      </div>
    );

  return (
    <div className={"container mx-auto flex flex-col gap-4 p-8"}>
      <h1>
        {t("homepage-page.welcome", dictionary, {
          name: session.user.name ?? session.user.email,
        })}
      </h1>
      <hr />
      <div className="flex">
        <Link className={buttonVariants()} href={`/${lang}/product`}>
          Product
        </Link>
      </div>
      <hr />
      <SignOutButton />
    </div>
  );
}
