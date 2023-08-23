/* eslint-disable @typescript-eslint/no-misused-promises */
import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().nonempty(),
  message: z.string().nonempty().max(1000),
});

const MessageForm = ({ fullName }: { fullName: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName,
      message: "",
    },
  });
  const { refetch: refetchMessage } = api.message.getAll.useQuery();
  const { mutate: addMessage, isLoading: isLoadingAddMessage } =
    api.message.create.useMutation({
      onError: async () => {
        toast({
          title: "Error",
          description: "Failed to add message, please try again later.",
          variant: "destructive",
        });
        await refetchMessage();
      },
      onSuccess: async () => {
        form.reset();
        toast({
          title: "Success",
          description: "Message added successfully.",
        });
        await refetchMessage();
      },
    });

  useEffect(() => {
    const charsCount = Number(form.watch("message").length);

    if (charsCount > 1000) {
      form.setError("message", {
        type: "max",
        message: "Message cannot be more than 1000 characters.",
      });
      form.setValue("message", form.watch("message").slice(0, 1000));
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addMessage({
      message: values.message,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Message</CardTitle>
        <CardDescription>
          Share your thoughts with me and other visitors.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your information is only used to display your name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here. Max 1000 characters."
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-2">
            <LogoutButton />
            <Button disabled={isLoadingAddMessage} type="submit">
              {isLoadingAddMessage && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoadingAddMessage ? "Loading..." : "AddMessage"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MessageForm;
