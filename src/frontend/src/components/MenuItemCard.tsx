import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import type { MenuItem } from "../data/menuData";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuItemCard({ item, index }: MenuItemCardProps) {
  const { items, addItem, updateQty, setIsOpen } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const qty = cartItem?.qty ?? 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.categoryKey,
      isVeg: item.isVeg,
    });
    setIsOpen(true);
  };

  return (
    <div
      className="bg-card rounded-xl overflow-hidden shadow-warm hover-lift border border-border flex flex-col"
      data-ocid={`menu.item.${index}`}
    >
      {/* Image area */}
      <div
        className="h-36 relative flex items-center justify-center overflow-hidden"
        style={{
          background: item.isVeg
            ? "linear-gradient(135deg, oklch(0.85 0.06 140 / 0.3), oklch(0.75 0.10 140 / 0.5))"
            : "linear-gradient(135deg, oklch(0.70 0.10 29 / 0.2), oklch(0.55 0.14 29 / 0.4))",
        }}
      >
        <div className="text-5xl select-none">
          {item.categoryKey.includes("biryani") ||
          item.categoryKey.includes("Biryani")
            ? "🍚"
            : item.categoryKey.includes("soups")
              ? "🍲"
              : item.categoryKey.includes("breads")
                ? "🫓"
                : item.categoryKey.includes("iceCream")
                  ? "🍨"
                  : item.categoryKey.includes("beverages") ||
                      item.categoryKey.includes("shakes")
                    ? "🥤"
                    : item.categoryKey.includes("mojito") ||
                        item.categoryKey.includes("Lemonade")
                      ? "🍹"
                      : item.isVeg
                        ? "🥗"
                        : "🍗"}
        </div>
        {/* Veg/Non-veg badge */}
        <div className="absolute top-2 left-2">
          <span
            className="w-5 h-5 rounded-sm border-2 flex items-center justify-center"
            style={{
              borderColor: item.isVeg ? "#22c55e" : "#ef4444",
              backgroundColor: "white",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.isVeg ? "#22c55e" : "#ef4444" }}
            />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <Badge
            variant="secondary"
            className="text-xs mb-2 font-body"
            style={{ fontSize: "10px" }}
          >
            {item.categoryLabel}
          </Badge>
          <h3 className="font-display font-semibold text-sm leading-snug text-card-foreground mb-1 line-clamp-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span
            className="font-bold text-base font-body"
            style={{ color: "oklch(0.35 0.14 29)" }}
          >
            ₹{item.price}
          </span>

          {qty === 0 ? (
            <Button
              size="sm"
              onClick={handleAdd}
              className="text-white text-xs h-8 px-3 font-body"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              data-ocid={`menu.primary_button.${index}`}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQty(item.id, qty - 1)}
                className="w-7 h-7 rounded-full"
                data-ocid={`menu.secondary_button.${index}`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-bold font-body w-4 text-center">
                {qty}
              </span>
              <Button
                size="icon"
                onClick={() => updateQty(item.id, qty + 1)}
                className="w-7 h-7 rounded-full text-white"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                data-ocid={`menu.primary_button.${index}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
