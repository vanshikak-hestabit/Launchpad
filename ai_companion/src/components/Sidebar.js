"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 text-gray-800 flex flex-col pt-16 px-6 gap-6">

      <Link
        href="/dashboard/todo"
        className="text-lg font-medium hover:text-black"
      >
        To-Do
      </Link>

      <Link
        href="/dashboard/notes"
        className="text-lg font-medium hover:text-black"
      >
        Notes
      </Link>

      <Link
        href="/dashboard/analytics"
        className="text-lg font-medium hover:text-black"
      >
        Analytics
      </Link>

    </div>
  );
}