"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";

const TableSearch = () => {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      {/* Adjusted for responsive width */}
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-full py-1 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primaryLight" // Changed to orange outline
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </form>
  );
};

export default TableSearch;
