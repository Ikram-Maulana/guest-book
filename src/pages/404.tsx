import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { NextSeo } from "next-seo";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <NextSeo title="404 Not Found" />

      <section className="container mx-auto flex h-screen max-w-7xl flex-col items-center justify-center text-center dark:text-zinc-50">
        <h1 className="mb-6 scroll-m-20 text-8xl font-extrabold tracking-tight text-primary lg:text-9xl">
          404
        </h1>
        <h2 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Page Not Found
        </h2>
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xl text-muted-foreground">
            The page you&apos;re looking for does not exist or an other error
            occurred, please go back to the homepage.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>
      </section>
    </>
  );
}
