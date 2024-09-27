import { Header } from "@/components/header";
import { Fragment } from "react";

export default function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-4 xl:px-0">
        {children}
      </main>
      {sheet}
    </Fragment>
  );
}
