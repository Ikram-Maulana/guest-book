import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { EnterIcon } from "@radix-ui/react-icons";
import { type FC } from "react";

const AuthPopup: FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("mt-2")}>
          <EnterIcon className="mr-2 h-3 w-3" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Please sign in using your github account to continue.
          </DialogDescription>
        </DialogHeader>

        <AuthButton />
      </DialogContent>
    </Dialog>
  );
};

export default AuthPopup;
