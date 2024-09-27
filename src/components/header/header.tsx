import { Home } from "lucide-react";
import Link from "next/link";

import { ProfileButton } from "../profile-button";
import { ThemeSwitcher } from "../theme";
import { Separator } from "../ui/separator";

export async function Header() {
  return (
    <header className="border-b py-6">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 xl:px-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <h2 className="text-4xl font-extrabold">Planr</h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Separator orientation="vertical" className="h-5" />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
