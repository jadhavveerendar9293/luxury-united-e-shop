import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/review/$productId")({
  head: () => ({ meta: [{ title: "Leave a Review — Luxury United" }] }),
  component: ReviewPage,
});

function ReviewPage() {
  const { productId } = useParams({ from: "/review/$productId" });
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center text-pearl/40 eyebrow">
          Loading...
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Share Your Thoughts"
          title="Leave a Review"
          description="Sign in to share your experience with this beautiful piece"
        />
        <section className="container-luxury pb-24">
          <div className="max-w-md mx-auto bg-card/40 border border-pearl/10 rounded p-12 text-center">
            <p className="text-pearl/50 mb-6">
              You need to be signed in to leave a review. Create an account or sign in to get started.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate({ to: "/login" })}
                className="bg-champagne text-obsidian px-8 py-3 eyebrow hover:bg-pearl transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate({ to: "/signup" })}
                className="border border-pearl/20 text-pearl px-8 py-3 eyebrow hover:border-pearl/40 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !review.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("reviews").insert([
        {
          product_id: productId,
          user_id: user?.id,
          rating,
          title,
          review,
          is_approved: false,
          is_featured: false,
          helpful_count: 0,
        },
      ] as any);

      if (error) throw error;

      toast.success("Thank you! Your review has been submitted and is pending approval.");
      navigate({ to: `/product/${productId}` });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Share Your Thoughts"
        title="Leave a Review"
        description={`Tell us what you think about this beautiful piece. Your feedback helps other customers discover quality.`}
      />

      <section className="container-luxury pb-24">
        <div className="max-w-2xl mx-auto bg-card/40 border border-pearl/10 rounded-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-sm font-serif text-champagne mb-4">
                Rating
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      fill={
                        star <= (hoverRating || rating)
                          ? "currentColor"
                          : "none"
                      }
                      stroke={
                        star <= (hoverRating || rating)
                          ? "currentColor"
                          : "currentColor"
                      }
                      className={`transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-champagne"
                          : "text-pearl/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-pearl/50 text-sm mt-2">
                {hoverRating || rating} of 5 stars
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-serif text-champagne mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience in a few words"
                maxLength={100}
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-3 text-pearl placeholder-pearl/40 focus:outline-none focus:border-champagne/40"
              />
              <p className="text-pearl/40 text-xs mt-2">
                {title.length}/100 characters
              </p>
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-serif text-champagne mb-2">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this piece. What do you love about it? Would you recommend it?"
                maxLength={1000}
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-3 text-pearl placeholder-pearl/40 focus:outline-none focus:border-champagne/40 min-h-40 resize-none"
              />
              <p className="text-pearl/40 text-xs mt-2">
                {review.length}/1000 characters
              </p>
            </div>

            {/* Note about moderation */}
            <div className="bg-obsidian/50 border border-pearl/10 rounded p-4">
              <p className="text-pearl/60 text-sm">
                Your review will be published after our team reviews it to ensure it meets our community guidelines. This usually takes 24-48 hours.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-champagne text-obsidian px-8 py-4 rounded font-serif hover:bg-pearl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: `/product/${productId}` })}
                className="border border-pearl/20 text-pearl px-8 py-4 rounded font-serif hover:border-pearl/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Author Info */}
          <div className="mt-12 pt-8 border-t border-pearl/10">
            <p className="text-pearl/70 text-sm">
              <strong>Posting as:</strong> {user?.full_name || user?.email}
            </p>
            <p className="text-pearl/40 text-xs mt-2">
              Your email address won't be published.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
