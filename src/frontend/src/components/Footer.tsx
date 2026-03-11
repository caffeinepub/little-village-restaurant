import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, UtensilsCrossed } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "oklch(0.14 0.05 52)" }}
    >
      {/* Gold divider */}
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              >
                <UtensilsCrossed
                  className="w-5 h-5"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-tight">
                  Little Village
                </p>
                <p className="text-xs" style={{ color: "oklch(0.73 0.15 83)" }}>
                  Restaurant
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.75 0.02 52)" }}
            >
              Traditional provisions are dished up in this spacious,
              unpretentious restaurant.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                aria-label="Instagram"
              >
                <SiInstagram
                  className="w-4 h-4"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                aria-label="Facebook"
              >
                <SiFacebook
                  className="w-4 h-4"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-display font-semibold text-base mb-4"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/about" as const, label: "About Us" },
                { to: "/menu" as const, label: "Our Menu" },
                { to: "/reservations" as const, label: "Reservations" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "oklch(0.75 0.02 52)" }}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display font-semibold text-base mb-4"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.75 0.02 52)" }}
                >
                  Service Road, Mangalagiri
                  <br />
                  Chinnakakani, AP 522508
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
                <a
                  href="tel:+919010038444"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "oklch(0.75 0.02 52)" }}
                >
                  090100 38444
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.73 0.15 83)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.75 0.02 52)" }}
                >
                  Open Daily · Closes 11:30 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="font-display font-semibold text-base mb-4"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Our Services
            </h4>
            <ul className="space-y-2">
              {[
                "All You Can Eat",
                "Private Dining Room",
                "Happy Hour Food",
                "Online Ordering",
                "Table Reservations",
                "Andhra Cuisine",
              ].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "oklch(0.73 0.15 83)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.75 0.02 52)" }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs border-t"
          style={{
            borderColor: "oklch(0.25 0.05 52)",
            color: "oklch(0.55 0.02 52)",
          }}
        >
          <p>© {year} Little Village Restaurant. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
