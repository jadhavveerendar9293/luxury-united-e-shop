import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — Luxury United" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate({ to: "/account" });
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to create account");
      return;
    }

    toast.success("Welcome to Luxury United! Please check your email to verify your account.");
    navigate({ to: "/login" });
  };

  return (
    <PageShell>
      <section className="container-luxury py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <p className="eyebrow text-champagne text-center mb-6">Join</p>
          <h1 className="font-serif text-4xl md:text-5xl text-center mb-12">Create account</h1>
          <form onSubmit={submit} className="space-y-6">
            <Field label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} minLength={6} />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-champagne text-obsidian py-4 eyebrow hover:bg-pearl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-pearl/50 mt-8">
            Already a member? <Link to="/login" className="text-champagne hairline-link">Sign in</Link>
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
