import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Define allowed email addresses (owner-only access)
const ALLOWED_EMAILS = [
  "philiapseudo@gmail.com",
  // Add more emails as needed
];

export async function EmailGuard({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // If no user, let the proxy handle redirect to sign-in
  // Email check only runs for authenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Skip email check if already on unauthorized, sign-in, or sign-up pages to prevent redirect loop
  if (pathname === "/unauthorized" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return <>{children}</>;
  }

  // Get all email addresses (case-insensitive check)
  const userEmails = user.emailAddresses.map((email) =>
    email.emailAddress.toLowerCase().trim()
  );

  // Check if any of the user's emails match the whitelist (case-insensitive)
  const allowedEmailsLower = ALLOWED_EMAILS.map((email) =>
    email.toLowerCase().trim()
  );

  const isAuthorized = userEmails.some((email) =>
    allowedEmailsLower.includes(email)
  );

  // Debug logging (remove in production)
  console.log("EmailGuard check:", {
    userId: user.id,
    userEmails,
    allowedEmails: ALLOWED_EMAILS,
    isAuthorized,
  });

  if (!isAuthorized) {
    // User is authenticated but not in whitelist - redirect to unauthorized
    redirect("/unauthorized");
  }

  return <>{children}</>;
}

