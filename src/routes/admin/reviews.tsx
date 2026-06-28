import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Star, Trash2, Check, X, ListFilter as Filter, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "Review Management — Luxury United" }] }),
  component: AdminReviewsPage,
});

type Review = Tables<"reviews"> & {
  product_name?: string;
  customer_name?: string;
  customer_email?: string;
};

function AdminReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "flagged">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.product_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (review.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "approved") {
      return matchesSearch && review.is_approved;
    } else if (statusFilter === "pending") {
      return matchesSearch && !review.is_approved;
    } else if (statusFilter === "flagged") {
      return matchesSearch && !review.is_approved;
    }
    return matchesSearch;
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("reviews")
        .update({ is_approved: true })
        .eq("id", id);

      if (error) throw error;
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
      );
      toast.success("Review approved");
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("reviews")
        .update({ is_approved: false })
        .eq("id", id);

      if (error) throw error;
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: false } : r))
      );
      toast.success("Review rejected");
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast.error("Failed to reject review");
    }
  };

  const handleFeature = async (id: string) => {
    try {
      const review = reviews.find((r) => r.id === id);
      const { error } = await (supabase as any)
        .from("reviews")
        .update({ is_featured: !review?.is_featured })
        .eq("id", id);

      if (error) throw error;
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, is_featured: !r.is_featured } : r
        )
      );
      toast.success(
        review?.is_featured ? "Review unfeatured" : "Review featured"
      );
    } catch (error) {
      console.error("Error toggling feature:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-pearl/50">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-pearl mb-2">Review Management</h2>
        <p className="text-pearl/50">Moderate and manage customer reviews</p>
      </div>

      <div className="bg-card/40 border border-pearl/10 rounded p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-3 text-pearl/40 size-4" />
            <input
              type="text"
              placeholder="Search by product, customer, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 pl-10 text-pearl placeholder-pearl/40 focus:outline-none focus:border-champagne/40"
            />
          </div>

          <div className="flex gap-2">
            <Filter className="size-4 text-pearl/40 mt-2.5" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "approved" | "pending" | "flagged"
                )
              }
              className="bg-obsidian/50 border border-pearl/20 rounded px-3 py-2 text-pearl focus:outline-none focus:border-champagne/40 text-sm"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-card/40 border border-pearl/10 rounded p-12 text-center">
          <p className="text-pearl/50">No reviews found</p>
        </div>
      ) : (
        <div className="bg-card/40 border border-pearl/10 rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-pearl/10 hover:bg-transparent">
                <TableHead className="text-pearl/70">Product</TableHead>
                <TableHead className="text-pearl/70">Customer</TableHead>
                <TableHead className="text-pearl/70">Title</TableHead>
                <TableHead className="text-pearl/70 text-center">Rating</TableHead>
                <TableHead className="text-pearl/70 text-center">Status</TableHead>
                <TableHead className="text-pearl/70 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="border-pearl/10 hover:bg-pearl/5"
                >
                  <TableCell className="text-pearl/80 text-sm">
                    {review.product_name || "Product"}
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm">
                    <div>
                      <p>{review.customer_name || "Customer"}</p>
                      <p className="text-pearl/40 text-xs">
                        {review.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm max-w-xs truncate">
                    {review.title || "Untitled"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="currentColor"
                          className="text-champagne"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        review.is_approved
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                    {review.is_featured && (
                      <div className="inline-block ml-2 text-champagne text-xs">
                        ✦ Featured
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      {!review.is_approved && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="p-1.5 rounded hover:bg-pearl/10 text-green-400 transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {review.is_approved && (
                        <button
                          onClick={() => handleReject(review.id)}
                          className="p-1.5 rounded hover:bg-pearl/10 text-yellow-400 transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleFeature(review.id)}
                        className={`p-1.5 rounded hover:bg-pearl/10 transition-colors ${
                          review.is_featured
                            ? "text-champagne"
                            : "text-pearl/40"
                        }`}
                        title="Toggle featured"
                      >
                        <Sparkles size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 rounded hover:bg-pearl/10 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
