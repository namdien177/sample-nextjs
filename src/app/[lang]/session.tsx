"use client";

import { type PropsWithChildren } from "react";
import { type auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";

const SessionContainer = ({
  children,
  session,
}: PropsWithChildren<{ session: Awaited<ReturnType<typeof auth>> }>) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionContainer;
