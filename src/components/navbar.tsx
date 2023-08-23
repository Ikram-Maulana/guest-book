import BurgerButton from "@/components/burger-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, SiteNavbar } from "@/data/navbar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

const Navbar: FC = () => {
  return (
    <header id="header" className="mx-auto w-full flex-none">
      <div className="container mx-auto flex w-full max-w-3xl items-center justify-between py-6">
        <div className="flex w-full items-center justify-between md:block">
          <Link href="/">
            <Image
              priority
              src="/logoipsum.webp"
              width={126}
              height={36}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
              alt="Logo Ipsum"
              className="pr-4"
            />
          </Link>

          <BurgerButton />
        </div>

        <NavigationMenu className={cn("hidden md:flex")}>
          <NavigationMenuList>
            {SiteNavbar.map((item) => (
              <NavigationMenuItem key={`nav-${item.name}`}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem className="px-2">
              <Separator orientation="vertical" className="h-9" />
            </NavigationMenuItem>

            {ExternalLink.map((item) => (
              <NavigationMenuItem key={`navExternalLink-${item.name}`}>
                <Link
                  href={item.href}
                  legacyBehavior
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.icon}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
