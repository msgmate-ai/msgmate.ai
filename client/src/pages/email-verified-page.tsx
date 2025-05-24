import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EmailVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for verifying your email address. Your account is now fully activated.
        </p>
        <div className="space-y-4">
          <Link href="/app">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}