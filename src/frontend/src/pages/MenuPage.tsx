import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import CartSidebar from "../components/CartSidebar";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../contexts/CartContext";
import { CATEGORIES, MENU_ITEMS } from "../data/menuData";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const { setIsOpen } = useCart();

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.categoryKey === activeCategory;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(search.toLowerCase());
      const matchesVeg =
        vegFilter === "all" ||
        (vegFilter === "veg" && item.isVeg) ||
        (vegFilter === "nonveg" && !item.isVeg);
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [search, activeCategory, vegFilter]);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section
        className="pt-24 pb-12 px-4 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.35 0.14 29) 0%, oklch(0.25 0.09 40) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.73 0.15 83) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.55 0.14 29) 0%, transparent 50%)",
          }}
        />
        <p
          className="text-sm uppercase tracking-widest font-body mb-2 relative z-10"
          style={{ color: "oklch(0.73 0.15 83)" }}
        >
          Explore Our
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 relative z-10">
          Full Menu
        </h1>
        <p className="text-white/70 font-body max-w-md mx-auto relative z-10">
          Over {MENU_ITEMS.length} authentic dishes across{" "}
          {CATEGORIES.length - 1} categories
        </p>
      </section>

      {/* Sticky controls */}
      <div
        className="sticky top-16 md:top-20 z-30 border-b border-border shadow-sm"
        style={{ backgroundColor: "oklch(var(--background))" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          {/* Search + filter row */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 font-body text-sm"
                data-ocid="menu.search_input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {(["all", "veg", "nonveg"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={vegFilter === f ? "default" : "outline"}
                  onClick={() => setVegFilter(f)}
                  className={`h-10 font-body text-xs px-3 ${
                    vegFilter === f ? "text-white" : ""
                  }`}
                  style={
                    vegFilter === f
                      ? { backgroundColor: "oklch(0.35 0.14 29)" }
                      : {}
                  }
                  data-ocid="menu.tab"
                >
                  {f === "all" ? (
                    <>
                      <SlidersHorizontal className="w-3 h-3 mr-1" />
                      All
                    </>
                  ) : f === "veg" ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1 inline-block" />
                      Veg
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-1 inline-block" />
                      Non-Veg
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Category tabs — native horizontal scroll */}
          <div
            className="overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "oklch(0.35 0.14 29) transparent",
            }}
          >
            <div className="flex gap-2" style={{ minWidth: "max-content" }}>
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-all shrink-0 ${
                    activeCategory === cat.key
                      ? "text-white"
                      : "text-muted-foreground bg-muted hover:text-foreground"
                  }`}
                  style={
                    activeCategory === cat.key
                      ? { backgroundColor: "oklch(0.35 0.14 29)" }
                      : {}
                  }
                  data-ocid="menu.tab"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="menu.empty_state"
          >
            <span className="text-5xl block mb-4">🔍</span>
            <p className="font-body">
              No dishes found. Try a different search or filter.
            </p>
            <Button
              variant="outline"
              className="mt-4 font-body"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setVegFilter("all");
              }}
              data-ocid="menu.secondary_button"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground font-body">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                items
                {activeCategory !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <Badge variant="secondary" className="font-body ml-1">
                      {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                    </Badge>
                  </span>
                )}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="font-body text-xs"
                onClick={() => setIsOpen(true)}
                data-ocid="menu.button"
              >
                View Cart
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item, i) => (
                <MenuItemCard key={item.id} item={item} index={i + 1} />
              ))}
            </div>
          </>
        )}
      </div>

      <CartSidebar />
    </div>
  );
}
