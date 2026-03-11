import { Input } from "@/components/ui/input";
import { Menu, Search, UtensilsCrossed } from "lucide-react";

interface AdminNavbarProps {
  pageTitle: string;
  onMobileMenuOpen: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

export default function AdminNavbar({
  pageTitle,
  onMobileMenuOpen,
  searchQuery = "",
  onSearchChange,
  showSearch = false,
}: AdminNavbarProps) {
  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-14 border-b bg-card shrink-0"
      style={{ borderColor: "oklch(0.73 0.15 83 / 0.2)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
          onClick={onMobileMenuOpen}
          data-ocid="admin.button"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-display font-semibold text-lg text-foreground">
          {pageTitle}
        </h1>
      </div>

      {/* Center: search */}
      {showSearch && (
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4 relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 h-9 font-body text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            data-ocid="admin.search_input"
          />
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-body font-semibold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
        >
          Admin
        </span>
        <div className="hidden sm:flex items-center gap-1.5">
          <UtensilsCrossed
            className="w-4 h-4"
            style={{ color: "oklch(0.73 0.15 83)" }}
          />
          <span className="text-sm font-body font-medium text-muted-foreground">
            Little Village
          </span>
        </div>
      </div>
    </header>
  );
}
