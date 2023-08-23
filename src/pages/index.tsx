import AuthButton from "@/components/auth-button";
import Layout from "@/components/layout";
import MessageForm from "@/components/message-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

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

      <div className="container mx-auto w-full max-w-3xl">
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

        {isLoadingGuestBook && <p>Loading...</p>}
        {!isLoadingGuestBook && guestBook && guestBook?.length <= 0 && (
          <p>No messages yet.</p>
        )}
        {!isLoadingGuestBook && guestBook && guestBook?.length > 0 && (
          <p>{JSON.stringify(guestBook, null, 2)}</p>
        )}
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
