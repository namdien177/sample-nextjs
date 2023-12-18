import { auth } from "~/server/auth";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import SignOutButton from "~/components/next-auth/SignOutButton";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function HomePage({ params: { lang } }: PageProps) {
  const session = await auth();
  if (!session)
    return (
      <div className={"container mx-auto flex flex-col gap-4 p-8"}>
        <p>You are unauthenticated. please login</p>
        <Link className={buttonVariants()} href="/sign-in">
          Login
        </Link>
      </div>
    );

  return (
    <div className={"container mx-auto flex flex-col gap-4 p-8"}>
      <p>You are authenticated</p>
      <p>Welcome back, {session.user.name ?? session.user.email}!</p>
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
