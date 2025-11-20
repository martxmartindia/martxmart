'use client';

import { Search } from 'lucide-react';

export default function SearchForm({ initialSearch }: { initialSearch?: string }) {
  return (
    <form
      className="max-w-lg mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get('search')?.toString();
        const newParams = new URLSearchParams(window.location.search);
        if (searchValue) {
          newParams.set('search', searchValue);
        } else {
          newParams.delete('search');
        }
        window.history.pushState({}, '', `/shopping?${newParams}`);
        window.location.reload(); // Trigger re-render with new search params
      }}
    >
      <div className="relative">
        <input
          type="text"
          name="search"
          defaultValue={initialSearch}
          placeholder="Search fashion, groceries, festival items..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}