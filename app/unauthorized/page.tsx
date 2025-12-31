import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Access Denied
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Your email address is not authorized to access this dashboard.
            Please contact the administrator if you believe this is an error.
          </p>
          <div className="flex flex-col gap-3">
            <SignOutButton>
              <button className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Sign Out
              </button>
            </SignOutButton>
            <Link
              href="/sign-in"
              className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Try Different Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

