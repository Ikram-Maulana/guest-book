import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { type Message, type User } from "@prisma/client";
import {
  DotsVerticalIcon,
  GitHubLogoIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import moment from "moment";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import { toast } from "@/components/ui/use-toast";

interface MessageCardProps {
  message: Message & {
    author: User;
  };
}

const MessageCard: FC<MessageCardProps> = ({ message }) => {
  const { data: sessionData } = useSession();
  const { refetch: refetchMessage } = api.message.getAll.useQuery();
  const { mutate: deleteMessage, isLoading: isLoadingDeleteMessage } =
    api.message.delete.useMutation({
      onError: async () => {
        toast({
          title: "Error",
          description: "Failed to add message, please try again later.",
          variant: "destructive",
        });
        await refetchMessage();
      },
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Message deleted successfully.",
        });
        await refetchMessage();
      },
    });

  const onDeleteHandler = (id: string) => {
    deleteMessage({ id });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <h2 className="font-bold text-primary">{message.author.name}</h2>
            <GitHubLogoIcon className="ml-2 h-4 w-4" />
          </div>
          <p className="text-sm font-medium leading-none text-muted-foreground">
            {moment(message.createdAt).format("L")}
          </p>
        </div>

        {sessionData?.user.id === message.authorId && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <DotsVerticalIcon className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => onDeleteHandler(message.id)}
                disabled={isLoadingDeleteMessage}
              >
                {isLoadingDeleteMessage && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="leading-7">{message.content}</p>
    </div>
  );
};

export default MessageCard;
