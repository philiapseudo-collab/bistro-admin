import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Define allowed email addresses (owner-only access)
const ALLOWED_EMAILS = [
  "philiapseudo@gmail.com",
  // Add more emails as needed
];

export async function EmailGuard({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  // If no user, let the proxy handle redirect to sign-in
  // Email check only runs for authenticated users
  if (!user) {
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

