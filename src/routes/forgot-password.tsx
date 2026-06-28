import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — Luxury United" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to send reset email");
      return;
    }

    setSent(true);
    toast.success("Password reset email sent");
  };

  return (
    <PageShell>
      <section className="container-luxury py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <p className="eyebrow text-champagne text-center mb-6">Reset</p>
          <h1 className="font-serif text-4xl md:text-5xl text-center mb-12">Forgot password</h1>

          {sent ? (
            <div className="text-center">
              <p className="text-pearl/70 mb-6">
                We've sent a password reset link to <span className="text-champagne">{email}</span>.
              </p>
              <p className="text-pearl/50 text-sm mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-champagne eyebrow hairline-link"
              >
                Try again
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <p className="text-pearl/60 text-center mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-champagne text-obsidian py-4 eyebrow hover:bg-pearl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-pearl/50 mt-8">
            Remember your password? <Link to="/login" className="text-champagne hairline-link">Sign in</Link>
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
