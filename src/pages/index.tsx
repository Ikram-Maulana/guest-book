import AuthButton from "@/components/auth-button";
import Layout from "@/components/layout";
import MessageCard from "@/components/message-card";
import MessageForm from "@/components/message-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { type Message, type User } from "@prisma/client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import React from "react";

type MessageAuthorType = Message & {
  author: User;
};

export default function Home() {
  const { data: sessionData, status } = useSession();
  const { data: guestBook, isLoading: isLoadingGuestBook } =
    api.message.getAll.useQuery(undefined, {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to get guest book, please try again later.",
          variant: "destructive",
        });
      },
    });

  return (
    <>
      <NextSeo title="Home" />

      <section
        id="hero"
        className="container mx-auto w-full max-w-3xl pb-6 pt-10"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Guestbook
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Leave a message for me below. It could be anything – appreciation,
          information, wisdom, or even humor. Surprise me!
        </p>
      </section>

      <div className="container mx-auto w-full max-w-3xl pb-8">
        {status === "loading" && (
          <Skeleton className="h-[172px] w-full rounded-xl md:h-[152px]" />
        )}
        {status === "unauthenticated" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Message</CardTitle>
              <CardDescription>
                Share your thoughts with me and other visitors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthButton className="w-fit" />
            </CardContent>
          </Card>
        )}
        {status === "authenticated" && (
          <MessageForm fullName={sessionData.user.name!} />
        )}
      </div>

      <div className="container mx-auto w-full max-w-3xl">
        {isLoadingGuestBook && (
          <div className="grid grid-cols-1 gap-4 pb-16 lg:pb-20">
            {Array.from({ length: 2 }).map((_, i) => (
              <React.Fragment key={`skeleton-${i}`}>
                <div>
                  <div className="mb-4 flex flex-col gap-2">
                    <Skeleton className="h-6 w-[138px]" />
                    <Skeleton className="h-[14px] w-20" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-[26px] w-full" />
                    <Skeleton className="h-[26px] w-full" />
                  </div>
                </div>
                <Separator className="my-2 hidden [&:not(:last-child)]:block" />
              </React.Fragment>
            ))}
          </div>
        )}
        {!isLoadingGuestBook && guestBook && guestBook?.length <= 0 && (
          <div className="pb-16 lg:pb-20">
            <Alert
              className={cn(
                "border-amber-500/50 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500",
              )}
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Guestbook data is empty, please add some data.
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!isLoadingGuestBook && guestBook && guestBook?.length > 0 && (
          <div className="grid grid-cols-1 gap-4 pb-16 lg:pb-20">
            {guestBook.map((message: MessageAuthorType) => (
              <React.Fragment key={`message-${message.id}`}>
                <MessageCard message={message} />
                <Separator className="my-2 hidden [&:not(:last-child)]:block" />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
