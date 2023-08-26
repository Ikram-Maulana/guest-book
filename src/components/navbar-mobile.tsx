import { Separator } from "@/components/ui/separator";
import { ExternalLink, SiteNavbar } from "@/data/navbar";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const NavbarMobile = ({ value }: { value: boolean }) => {
  return (
    <div
      className={cn(
        "container fixed inset-0 top-[72px] z-50 mx-auto grid h-[calc(100vh-4rem)] max-w-7xl grid-flow-row auto-rows-max overflow-auto px-8 py-6 pb-32 transition-all duration-200",
        value
          ? "left-0 ease-out animate-in slide-in-from-left-80"
          : "-left-[9999px] ease-in animate-out slide-out-to-left-80",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-zinc-50/90 p-4 shadow-lg outline outline-1 outline-zinc-200 backdrop-blur-sm">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {SiteNavbar.map((item) => (
            <Link
              key={`navMobile-${item.name}`}
              href={item.href}
              className="flex w-full items-center gap-4 rounded-md p-2 text-sm font-medium hover:underline"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <div className="py-3">
            <Separator />
          </div>

          {ExternalLink.map((item) => (
            <Link
              key={`navMobileExternalLink-${item.name}`}
              href={item.href}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <p>{item.name}</p>
              </div>

              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavbarMobile;
