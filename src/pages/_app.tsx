import { SiteMetadata } from "@/lib/metadata";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>

      <SessionProvider session={session}>
        <DefaultSeo
          titleTemplate={`%s | ${SiteMetadata.name}`}
          defaultTitle={SiteMetadata.title}
          additionalLinkTags={[
            {
              rel: "icon",
              href: "/favicon.ico",
            },
          ]}
          additionalMetaTags={[
            {
              name: "viewport",
              content: "width=device-width, initial-scale=1",
            },
          ]}
          description={SiteMetadata.description}
          themeColor="#FFFFFF"
          openGraph={{
            type: "website",
            locale: "en_US",
            site_name: SiteMetadata.name,
            url: SiteMetadata.origin,
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </>,
  );
};

export default api.withTRPC(MyApp);
