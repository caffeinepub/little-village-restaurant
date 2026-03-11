import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";

const NAV_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/menu" as const, label: "Menu" },
  { to: "/reservations" as const, label: "Reservations" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-warm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
          >
            <UtensilsCrossed
              className="w-5 h-5"
              style={{ color: "oklch(0.73 0.15 83)" }}
            />
          </div>
          <div className="hidden sm:block">
            <span
              className="font-display font-bold text-lg leading-tight block"
              style={{
                color: scrolled || currentPath !== "/" ? undefined : "white",
              }}
            >
              Little Village
            </span>
            <span
              className="text-xs font-body leading-none block"
              style={{
                color:
                  scrolled || currentPath !== "/"
                    ? "oklch(0.73 0.15 83)"
                    : "oklch(0.90 0.10 83)",
              }}
            >
              Restaurant
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-all duration-200 relative ${
                  currentPath === link.to
                    ? "text-primary"
                    : scrolled || currentPath !== "/"
                      ? "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
                {currentPath === link.to && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: "oklch(0.73 0.15 83)" }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-full ${
              scrolled || currentPath !== "/"
                ? ""
                : "text-white hover:bg-white/20"
            }`}
            data-ocid="nav.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Cart button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={`rounded-full relative ${
              scrolled || currentPath !== "/"
                ? ""
                : "text-white hover:bg-white/20"
            }`}
            data-ocid="nav.button"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden rounded-full ${
                  scrolled || currentPath !== "/"
                    ? ""
                    : "text-white hover:bg-white/20"
                }`}
                data-ocid="nav.button"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <div className="flex items-center gap-2 mb-8">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                >
                  <UtensilsCrossed
                    className="w-4 h-4"
                    style={{ color: "oklch(0.73 0.15 83)" }}
                  />
                </div>
                <span className="font-display font-bold">
                  Little Village Restaurant
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-body font-medium transition-colors ${
                        currentPath === link.to
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                      data-ocid="nav.link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href="https://wa.me/919010038444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-body text-sm font-medium"
                  style={{
                    backgroundColor: "oklch(0.35 0.14 29 / 0.1)",
                    color: "oklch(0.35 0.14 29)",
                  }}
                >
                  Order via WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
