import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Send, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useCreateOrder } from "../hooks/useQueries";

export default function CartSidebar() {
  const {
    items,
    removeItem,
    updateQty,
    clearCart,
    totalPrice,
    isOpen,
    setIsOpen,
  } = useCart();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    isPickup: false,
    instructions: "",
  });

  const handleOrder = async () => {
    if (!form.name || !form.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const _orderLines = items
      .map((i) => `${i.name} x${i.qty} - ₹${i.price * i.qty}`)
      .join("%0A");

    const msg = [
      "*Order from Little Village Restaurant*",
      `Customer: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.isPickup ? "Pickup" : form.address || "Not specified"}`,
      "",
      "*Order Items:*",
      items.map((i) => `${i.name} x${i.qty} - ₹${i.price * i.qty}`).join("\n"),
      "",
      `*Total: ₹${totalPrice}*`,
      `Order Time: ${time}`,
      form.instructions ? `\nSpecial Instructions: ${form.instructions}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/919010038444?text=${encodeURIComponent(msg)}`;

    // Also save to backend
    try {
      await createOrder.mutateAsync({
        customerName: form.name,
        phone: form.phone,
        address: form.isPickup ? "Pickup" : form.address,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        totalAmount: totalPrice,
        specialInstructions: form.instructions,
      });
    } catch {
      // Backend may not be ready, proceed with WhatsApp anyway
    }

    window.open(waUrl, "_blank");
    clearCart();
    setIsOpen(false);
    setForm({
      name: "",
      phone: "",
      address: "",
      isPickup: false,
      instructions: "",
    });
    toast.success("Order sent via WhatsApp!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-display text-lg">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground"
            data-ocid="cart.empty_state"
          >
            <span className="text-5xl">🛒</span>
            <p className="font-body text-sm">Your cart is empty</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="mt-2 font-body"
              data-ocid="cart.cancel_button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Cart Items */}
            <div className="px-6 py-4 space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: item.isVeg ? "#22c55e" : "#ef4444",
                        }}
                      />
                      <p className="text-sm font-semibold font-body truncate">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-6 h-6 rounded-full"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      data-ocid={`cart.secondary_button.${idx + 1}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-5 text-center text-sm font-bold">
                      {item.qty}
                    </span>
                    <Button
                      size="icon"
                      className="w-6 h-6 rounded-full text-white"
                      style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      data-ocid={`cart.primary_button.${idx + 1}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 rounded-full text-destructive"
                      onClick={() => removeItem(item.id)}
                      data-ocid={`cart.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Subtotal */}
            <div className="px-6 py-3 flex items-center justify-between">
              <span className="font-semibold font-body">Subtotal</span>
              <span
                className="font-bold text-lg font-body"
                style={{ color: "oklch(0.35 0.14 29)" }}
              >
                ₹{totalPrice}
              </span>
            </div>

            <Separator />

            {/* Checkout form */}
            <div className="px-6 py-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">
                Delivery Details
              </h3>

              <div className="space-y-1">
                <Label htmlFor="cart-name" className="text-xs font-body">
                  Your Name *
                </Label>
                <Input
                  id="cart-name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="h-9 text-sm font-body"
                  data-ocid="cart.input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cart-phone" className="text-xs font-body">
                  Phone Number *
                </Label>
                <Input
                  id="cart-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="h-9 text-sm font-body"
                  data-ocid="cart.input"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cart-pickup"
                  checked={form.isPickup}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isPickup: e.target.checked }))
                  }
                  className="rounded"
                  data-ocid="cart.checkbox"
                />
                <Label
                  htmlFor="cart-pickup"
                  className="text-xs font-body cursor-pointer"
                >
                  Pickup from restaurant
                </Label>
              </div>

              {!form.isPickup && (
                <div className="space-y-1">
                  <Label htmlFor="cart-address" className="text-xs font-body">
                    Delivery Address
                  </Label>
                  <Textarea
                    id="cart-address"
                    placeholder="Enter delivery address"
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    className="text-sm font-body resize-none h-16"
                    data-ocid="cart.textarea"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label
                  htmlFor="cart-instructions"
                  className="text-xs font-body"
                >
                  Special Instructions
                </Label>
                <Textarea
                  id="cart-instructions"
                  placeholder="Any special requests?"
                  value={form.instructions}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, instructions: e.target.value }))
                  }
                  className="text-sm font-body resize-none h-16"
                  data-ocid="cart.textarea"
                />
              </div>

              <Button
                className="w-full font-body text-white font-semibold h-11"
                style={{ backgroundColor: "#25D366" }}
                onClick={handleOrder}
                disabled={createOrder.isPending}
                data-ocid="cart.submit_button"
              >
                <Send className="w-4 h-4 mr-2" />
                {createOrder.isPending
                  ? "Sending..."
                  : "Place Order via WhatsApp"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
