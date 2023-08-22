import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { type FC } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Login: FC = () => {
  return (
    <>
      <NextSeo title="Login" />

      <div className="container absolute inset-0 mx-auto flex h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center space-y-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="mx-auto max-w-4xl pb-10 text-center md:pb-16">
              <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Welcome Back
              </h1>
              <div className="mx-auto max-w-3xl">
                <p className="mb-6 max-w-prose text-center text-base text-muted-foreground sm:text-lg">
                  Please sign in using your github account to continue.
                </p>
              </div>

              <AuthButton className="w-fit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
