import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };
  return (
    <span>
      <Button
        onClick={handleSignOut}
        variant={"ghost"}
        size={"sm"}
        className="cursor-pointer py-4"
      >
        <LogIn className="h-4 w-4 mr-1" />
        Sign Out
      </Button>
    </span>
  );
};

export default SignOut;
