import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, LogIn, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminMenuManager from "../components/admin/AdminMenuManager";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminOrders from "../components/admin/AdminOrders";
import AdminReservations from "../components/admin/AdminReservations";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useInitializeAdmin, useIsAdmin } from "../hooks/useQueries";

type AdminView = "dashboard" | "menu" | "orders" | "reservations";

const PAGE_TITLES: Record<AdminView, string> = {
  dashboard: "Overview",
  menu: "Menu Manager",
  orders: "Orders",
  reservations: "Reservations",
};

function AdminSetupForm({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState("");
  const initAdmin = useInitializeAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error("Please enter the admin token");
      return;
    }
    try {
      await initAdmin.mutateAsync(token.trim());
      toast.success("Admin access granted! Refreshing...");
      onSuccess();
    } catch {
      toast.error("Invalid token. Please check and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label className="font-body text-sm text-foreground">Admin Token</Label>
        <Input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your admin token"
          className="font-body"
          data-ocid="admin.input"
        />
        <p className="text-xs text-muted-foreground font-body">
          Find this token in your Caffeine project settings under "Admin Token".
        </p>
      </div>
      <Button
        type="submit"
        className="w-full text-white font-body font-semibold shadow-warm"
        style={{
          backgroundImage:
            "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
        }}
        disabled={initAdmin.isPending}
        data-ocid="admin.submit_button"
      >
        {initAdmin.isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <KeyRound className="w-4 h-4 mr-2" />
        )}
        Claim Admin Access
      </Button>
    </form>
  );
}

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const isLoggingIn = loginStatus === "logging-in";
  const [showSetup, setShowSetup] = useState(false);

  // Dashboard state
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const showSearch = activeView === "orders" || activeView === "menu";

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-2xl shadow-warm-lg ornamental-border p-8">
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.35 0.14 29 / 0.12), oklch(0.73 0.15 83 / 0.12))",
                }}
              >
                <UtensilsCrossed
                  className="w-8 h-8"
                  style={{ color: "oklch(0.35 0.14 29)" }}
                />
              </div>
              <p className="text-xs font-body tracking-widest uppercase text-gold font-semibold mb-2">
                Little Village Restaurant
              </p>
              <h1 className="font-display text-2xl font-bold text-card-foreground">
                Admin Login
              </h1>
              <div className="gold-divider w-24 mx-auto mt-3 mb-1" />
              <p className="text-muted-foreground font-body text-sm mt-3">
                Secure access for restaurant management
              </p>
            </div>

            <Button
              className="w-full h-12 text-white font-body font-semibold shadow-warm hover:shadow-warm-lg transition-all"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
              }}
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center font-body mt-4">
              Admin access only.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div
            className="bg-card rounded-2xl shadow-warm-lg ornamental-border p-8"
            data-ocid="admin.error_state"
          >
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.55 0.20 20 / 0.10), oklch(0.73 0.15 83 / 0.08))",
                }}
              >
                <KeyRound
                  className="w-8 h-8"
                  style={{ color: "oklch(0.55 0.20 20)" }}
                />
              </div>
              <p className="text-xs font-body tracking-widest uppercase text-gold font-semibold mb-2">
                Little Village Restaurant
              </p>
              <h2 className="font-display text-xl font-bold text-foreground">
                Admin Setup Required
              </h2>
              <div className="gold-divider w-24 mx-auto mt-3" />
              <p className="text-muted-foreground font-body text-sm mt-3">
                Your account needs to be verified as admin. Enter the admin
                token to claim access.
              </p>
            </div>

            {!showSetup ? (
              <div className="space-y-3">
                <Button
                  className="w-full text-white font-body font-semibold shadow-warm"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
                  }}
                  onClick={() => setShowSetup(true)}
                  data-ocid="admin.primary_button"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Enter Admin Token
                </Button>
                <p className="text-xs text-muted-foreground text-center font-body">
                  Logged in as{" "}
                  <span className="font-mono">
                    {identity.getPrincipal().toString().slice(0, 16)}...
                  </span>
                </p>
              </div>
            ) : (
              <AdminSetupForm
                onSuccess={() => {
                  setTimeout(() => window.location.reload(), 1500);
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Full admin dashboard with sidebar layout
  return (
    <div className="min-h-screen flex pt-16 bg-background">
      {/* Sidebar */}
      <AdminSidebar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view as AdminView);
          setSearchQuery("");
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          pageTitle={PAGE_TITLES[activeView]}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          showSearch={showSearch}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeView === "dashboard" && <AdminDashboard />}
          {activeView === "menu" && (
            <AdminMenuManager searchQuery={searchQuery} />
          )}
          {activeView === "orders" && <AdminOrders searchQuery={searchQuery} />}
          {activeView === "reservations" && <AdminReservations />}
        </main>

        {/* Footer */}
        <footer className="text-center py-3 border-t text-xs font-body text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.35 0.14 29)" }}
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
