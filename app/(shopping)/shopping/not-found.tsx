"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Custom404() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      window.location.href = `/support?query=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-6">
          You’ve wandered off the path in martXmart’s bazar. Let’s get you back!
        </p>

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              className="pl-9 w-full text-sm sm:text-base border-gray-300 dark:border-gray-600 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search support topics"
            />
          </div>
          <Button
            type="submit"
            className="px-4 py-2 text-sm sm:text-base bg-orange-600 hover:bg-orange-700 text-white rounded-md"
            aria-label="Search"
          >
            Search
          </Button>
        </form>

        <div className="text-center space-x-2">
          <Button
            variant="default"
            className=" text-sm sm:text-base"
            asChild
            aria-label="Return to Home"
          >
            <Link href="/shopping">Back to Home</Link>
          </Button>
          <Button
            variant="destructive"
            className=" text-sm sm:text-base"
            asChild
            aria-label="Return to Support Center"
          >
            <Link href="/support">Back to Support</Link>
          </Button>
          
        </div>
      </div>
    </div>
  );
}