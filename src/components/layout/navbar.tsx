"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl">TechMart</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((navItem) => {
                const isActive = pathname.startsWith(navItem.href);
                return (
                  <NavigationMenuItem key={navItem.href}>
                    <Link href={navItem.href}>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md font-semibold"
                            : "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        {navItem.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link href="/user">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            <Link href="/auth/signin">
              <Button
                variant="default"
                size="sm"
                className="ml-2 hidden lg:inline-flex"
              >
                Sign In
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 border-t bg-background">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((navItem) => {
                  const isActive = pathname.startsWith(navItem.href);
                  return (
                    <Link
                      key={navItem.href}
                      href={navItem.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {navItem.label}
                    </Link>
                  );
                })}

                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-md transition"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
