"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  const handleAccept = async () => {
    if (!token || !session?.user) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/invite/accept", {
        method: "POST",
        body: JSON.stringify({ token, userId: session.user.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const msg = await res.text();
        setError(msg || "Failed to accept invitation.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  }

  if (status === "unauthenticated") {
    return (
      <Card className="max-w-md mx-auto border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Invitation Received</CardTitle>
          <CardDescription>Please sign in or create an account to accept the invitation and join your team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button className="w-full font-semibold shadow-lg shadow-primary/20" onClick={() => router.push(`/login?callbackUrl=/accept-invitation?token=${token}`)}>
            Sign In to Accept
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>
          <Button variant="outline" className="w-full font-semibold" onClick={() => router.push(`/signup?callbackUrl=/accept-invitation?token=${token}`)}>
            Create New Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto border-none shadow-xl bg-background/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Accept Invitation</CardTitle>
        <CardDescription>You have been invited to join a team on TenderIQ. Collaborate on tenders and projects with your colleagues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center pt-4">
        {success ? (
          <div className="space-y-4 py-8 animate-in zoom-in duration-300">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-foreground">Welcome to the Team!</p>
              <p className="text-sm text-muted-foreground">We're setting up your access now. Redirecting you...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm flex items-start gap-3 text-left border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-foreground/80 leading-relaxed">
                By accepting, you will gain access to your team's shared tenders, BOQs, and vendor comparisons.
              </p>
            </div>
            <Button className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={handleAccept} disabled={loading || !token}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Accept and Join Team
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
        <AcceptInvitationContent />
      </Suspense>
    </div>
  );
}
