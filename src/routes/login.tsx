import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Luxury United" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    if (isAdmin) {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/account" });
    }
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Welcome back");
    // Navigation will be handled by auth state change
  };

  return (
    <PageShell>
      <section className="container-luxury py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <p className="eyebrow text-champagne text-center mb-6">Members</p>
          <h1 className="font-serif text-4xl md:text-5xl text-center mb-12">Sign in</h1>
          <form onSubmit={submit} className="space-y-6">
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-champagne text-obsidian py-4 eyebrow hover:bg-pearl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-6">
            <Link to="/forgot-password" className="text-sm text-pearl/50 hover:text-champagne">
              Forgot password?
            </Link>
          </div>
          <p className="text-center text-sm text-pearl/50 mt-8">
            New here? <Link to="/signup" className="text-champagne hairline-link">Create account</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-pearl/60 mb-2 block">{label}</span>
      <input {...props} className="w-full bg-transparent border-b border-pearl/20 py-3 text-sm focus:outline-none focus:border-champagne transition-colors disabled:opacity-50" />
    </label>
  );
}
