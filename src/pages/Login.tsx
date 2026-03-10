import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/dashboard";
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + from,
        },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-card border border-border rounded-2xl p-6"
      >
        <h1 className="text-2xl font-black text-foreground mb-2">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to sync your 30-day lessons and progress across devices.
        </p>

        {sent ? (
          <div className="space-y-3">
            <p className="text-foreground font-semibold">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <span className="font-semibold text-foreground">{email}</span>.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="w-full btn-duo-secondary"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              disabled={!email || loading}
              onClick={sendMagicLink}
              className="w-full btn-duo-primary disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full text-sm text-muted-foreground font-semibold py-2"
            >
              Back
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;

