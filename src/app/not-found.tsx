"use client"
import Link from "next/link"
import { Search, Home, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-primary/20">404</div>
          <div className="flex justify-center">
            <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <p className="text-sm text-muted-foreground">
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-medium">Looking for something specific?</h3>
          <div className="flex w-full max-w-md mx-auto space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button type="submit">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-sm text-muted-foreground">
          <p>
            Still need help?{" "}
            <Link 
              href="/contact" 
              className="text-primary hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
