import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("Auth callback error:", error);
        navigate({ to: "/login" });
        return;
      }

      // Get the user profile to determine redirect
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (profile?.role === "admin") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/account" });
        }
      } else {
        navigate({ to: "/" });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <PageShell>
      <div className="container-luxury py-32 text-center">
        <p className="text-pearl/60 eyebrow">Completing sign in...</p>
      </div>
    </PageShell>
  );
}
