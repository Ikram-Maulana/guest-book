/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ExitIcon, ReloadIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useState } from "react";

const LogoutButton = ({
  isLoadingAddMessage,
}: {
  isLoadingAddMessage: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error logging out.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isLoadingAddMessage || isLoading}
        >
          {isLoading ? (
            <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <ExitIcon className="mr-2 h-4 w-4" />
          )}
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will log you out of your account. You will be prompted
            to login again when accessing the site. Do you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logoutHandler}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
