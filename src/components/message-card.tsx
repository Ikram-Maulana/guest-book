import { type Message, type User } from "@prisma/client";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import moment from "moment";
import { type FC } from "react";

interface MessageCardProps {
  message: Message & {
    author: User;
  };
}

const MessageCard: FC<MessageCardProps> = ({ message }) => {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center">
          <h2 className="font-bold text-primary">{message.author.name}</h2>
          <GitHubLogoIcon className="ml-2 h-4 w-4" />
        </div>

        <p className="text-sm font-medium leading-none text-muted-foreground">
          {moment(message.createdAt).format("L")}
        </p>
      </div>
      <p className="leading-7">{message.content}</p>
    </div>
  );
};

export default MessageCard;
