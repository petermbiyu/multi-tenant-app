"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Brain, Home, LogIn, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOut from "./signOut";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const pathName = usePathname();
  const getNavItems = () => {
    const baseItems = [
      { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
      {
        href: "/select-org",
        label: "Switch organization",
        icon: <User className="w-4 h-4" />,
      },
    ];
    return [...baseItems];
  };
  const navItems = getNavItems();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* logo */}
        <Link href={"/"} className="flex items-center gap-2 font-bold text-xl">
          <Brain className="h-6 w-6 text-blue-600" />
          DocuAI
        </Link>
        {/* nav */}
        <nav className="md:flex items-centergap-1">
          {navItems.map((item) => {
            const isActive =
              pathName === item.href ||
              (item.href != "/" && pathName?.startsWith(item.href));
            return (
              <Link href={item.href} key={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        {/* auth */}
        <div className="flex items-center gap-4">
          {/* signedIn */}
          {/* signup & signin*/}
          <div>
            {!isPending && session ? (
              <div>
                <SignOut />
              </div>
            ) : (
              <div className="md:flex items-center gap-2">
                <Link href={"/auth"}>
                  <Button size={"sm"} className="cursor-pointer py-4">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
