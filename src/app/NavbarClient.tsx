"use client";
import { Navbar } from "@/components";
import { SessionProvider } from "next-auth/react";

export default function NavbarClient() {
  return (
    <SessionProvider>
      <Navbar />
    </SessionProvider>
  );
}
