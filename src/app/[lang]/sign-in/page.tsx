import { auth } from "~/server/auth";
import FormLogin from "./form";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return <FormLogin />;
};

export default Page;
