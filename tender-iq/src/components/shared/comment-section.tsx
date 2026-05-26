"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function CommentSection({ tenderId, projectId }: { tenderId?: string, projectId?: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const query = tenderId ? `tenderId=${tenderId}` : `projectId=${projectId}`;
      try {
        const res = await fetch(`/api/comments?${query}`);
        if (res.ok) {
          const data = await res.json();
          // The API returns simple objects, we need to ensure they match our interface
          // If the API include is working, it should have the user
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [tenderId, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ content: newComment, tenderId, projectId }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const comment = await res.json();
        // Since we don't have the user object in the response (it just created the comment)
        // we might need to fetch again or optimistically add if we had session
        // For simplicity in this demo, let's just re-fetch or assume the response might be enriched
        // Better yet, just re-fetch for now to be safe with the user object
        const refreshRes = await fetch(`/api/comments?${tenderId ? `tenderId=${tenderId}` : `projectId=${projectId}`}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setComments(data);
        }
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-4">Loading comments...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Add a comment..."
          className="bg-background/50 border-muted focus-visible:ring-primary/20"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={submitting}
        />
        <Button type="submit" size="icon" disabled={submitting} className="shrink-0">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 p-3 rounded-lg bg-background/40 border border-muted/50 hover:border-primary/20 transition-colors"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                {comment.user?.name?.[0] || comment.user?.email?.[0] || "U"}
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate pr-2">{comment.user?.name || comment.user?.email}</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-foreground/90 break-words leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
            <MessageSquare className="h-10 w-10 mb-2 stroke-[1.5px]" />
            <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
