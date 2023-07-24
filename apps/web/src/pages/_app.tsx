import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import AdminLayout from "@/layout/admin-layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AdminLayout>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </AdminLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
