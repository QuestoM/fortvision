"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Menu, BarChart3 } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure a consistent initial render that matches the server
  // A simple version without any interactive elements while not mounted
  if (!mounted) {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="lg:hidden w-9 h-9 flex items-center justify-center"></div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex space-x-0.5">
                <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
                <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
                <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
                <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
                <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
              </div>
              <span className="font-medium text-lg">Advertising Analytics</span>
            </Link>
          </div>
          <div className="flex items-center justify-end gap-3 ml-auto">
            <div className="w-9 h-9"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="max-w-[1400px] mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/95 backdrop-blur-xl">
              <div className="grid gap-2 py-6">
                <MobileNav />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex space-x-0.5">
              <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
              <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
              <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
              <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
              <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
            </div>
            <span className="font-medium text-lg">Advertising Analytics</span>
          </Link>
        </div>
        
        <SignedIn>
          <nav className="hidden lg:flex items-center justify-center mx-auto gap-6 text-sm">
            <Link href="/dashboard?platform=google" className="font-medium transition-colors hover:text-[#4285F4]">
              Google Ads
            </Link>
            <Link href="/dashboard?platform=facebook" className="font-medium transition-colors hover:text-[#1877F2]">
              Facebook Ads
            </Link>
            <Link href="/analytics" className="font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-200">
              Analytics
            </Link>
            <Link href="/settings" className="font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-200">
              Settings
            </Link>
          </nav>
        </SignedIn>

        <div className="flex items-center justify-end gap-3 ml-auto">
          <ThemeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm font-medium text-[#4285F4] hover:text-[#4285F4]/80 hover:bg-[#4285F4]/10">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm">Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <div className="flex flex-col gap-4 text-foreground">
      <Link href="/" className="flex items-center gap-2 font-medium hover:text-[#4285F4]">
        Home
      </Link>
      <SignedIn>
        <Link href="/dashboard?platform=google" className="flex items-center gap-2 font-medium hover:text-[#4285F4]">
          Google Ads
        </Link>
        <Link href="/dashboard?platform=facebook" className="flex items-center gap-2 font-medium hover:text-[#1877F2]">
          Facebook Ads
        </Link>
        <Link href="/analytics" className="flex items-center gap-2 font-medium hover:text-gray-900 dark:hover:text-gray-200">
          Analytics
        </Link>
        <Link href="/settings" className="flex items-center gap-2 font-medium hover:text-gray-900 dark:hover:text-gray-200">
          Settings
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="flex items-center gap-2 font-medium hover:text-[#4285F4]">
          Sign In
        </Link>
        <Link href="/sign-up" className="flex items-center gap-2 font-medium hover:text-[#1877F2]">
          Sign Up
        </Link>
      </SignedOut>
    </div>
  )
} 