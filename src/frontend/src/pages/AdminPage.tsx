import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogIn,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { MenuCategory, OrderStatus, ReservationStatus } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddMenuItem,
  useAllMenuItems,
  useAllOrders,
  useAllReservations,
  useAnalytics,
  useDeleteMenuItem,
  useInitializeAdmin,
  useIsAdmin,
  useUpdateMenuItem,
  useUpdateOrderStatus,
  useUpdateReservationStatus,
} from "../hooks/useQueries";

const CATEGORY_OPTIONS = [
  { value: MenuCategory.soupsVeg, label: "Veg Soups" },
  { value: MenuCategory.soupsNonVeg, label: "Non-Veg Soups" },
  { value: MenuCategory.startersVeg, label: "Starters Veg" },
  { value: MenuCategory.startersNonVeg, label: "Starters Non-Veg" },
  { value: MenuCategory.chineseVeg, label: "Chinese Veg" },
  { value: MenuCategory.chineseNonVeg, label: "Chinese Non-Veg" },
  { value: MenuCategory.breads, label: "Indian Breads" },
  { value: MenuCategory.curriesVeg, label: "Veg Curries" },
  { value: MenuCategory.andhraCurries, label: "Andhra Special" },
  { value: MenuCategory.curriesNonVeg, label: "Non-Veg Curries" },
  { value: MenuCategory.riceNoodlesVeg, label: "Rice & Noodles Veg" },
  { value: MenuCategory.riceNoodlesNonVeg, label: "Rice & Noodles" },
  { value: MenuCategory.biryanisVeg, label: "Veg Biryanis" },
  { value: MenuCategory.biryanisNonVeg, label: "Non-Veg Biryanis" },
  { value: MenuCategory.familyPacksVeg, label: "Family Packs Veg" },
  { value: MenuCategory.familyPacksNonVeg, label: "Family Packs" },
  { value: MenuCategory.rice, label: "Rice" },
  { value: MenuCategory.iceCream, label: "Ice Creams" },
  { value: MenuCategory.beverages, label: "Beverages" },
  { value: MenuCategory.shakes, label: "Shakes" },
  { value: MenuCategory.premiumShakes, label: "Premium Shakes" },
  { value: MenuCategory.mojitosLemonades, label: "Mojitos & Lemonades" },
];

const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  [OrderStatus.pending]: { label: "Pending", color: "oklch(0.73 0.15 83)" },
  [OrderStatus.preparing]: {
    label: "Preparing",
    color: "oklch(0.60 0.15 220)",
  },
  [OrderStatus.ready]: { label: "Ready", color: "oklch(0.55 0.15 140)" },
  [OrderStatus.delivered]: {
    label: "Delivered",
    color: "oklch(0.50 0.10 140)",
  },
};

const RESERVATION_STATUS_LABELS: Record<
  ReservationStatus,
  { label: string; color: string }
> = {
  [ReservationStatus.pending]: {
    label: "Pending",
    color: "oklch(0.73 0.15 83)",
  },
  [ReservationStatus.confirmed]: {
    label: "Confirmed",
    color: "oklch(0.55 0.15 140)",
  },
  [ReservationStatus.cancelled]: {
    label: "Cancelled",
    color: "oklch(0.55 0.20 20)",
  },
};

type MenuItemForm = {
  name: string;
  category: MenuCategory;
  price: string;
  isVeg: boolean;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
};

const DEFAULT_FORM: MenuItemForm = {
  name: "",
  category: MenuCategory.curriesNonVeg,
  price: "",
  isVeg: false,
  description: "",
  imageUrl: "",
  isAvailable: true,
};

function MenuManagement() {
  const { data: menuItems, isLoading } = useAllMenuItems();
  const addItem = useAddMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [form, setForm] = useState<MenuItemForm>(DEFAULT_FORM);

  const setField = <K extends keyof MenuItemForm>(k: K, v: MenuItemForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => {
    setEditId(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (item: NonNullable<typeof menuItems>[number]) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      isVeg: item.isVeg,
      description: item.description,
      imageUrl: item.imageUrl ?? "",
      isAvailable: item.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    try {
      if (editId != null) {
        await updateItem.mutateAsync({
          id: editId,
          name: form.name,
          category: form.category,
          price: Number.parseFloat(form.price),
          isVeg: form.isVeg,
          description: form.description,
          imageUrl: form.imageUrl || undefined,
          isAvailable: form.isAvailable,
        });
        toast.success("Menu item updated");
      } else {
        await addItem.mutateAsync({
          name: form.name,
          category: form.category,
          price: Number.parseFloat(form.price),
          isVeg: form.isVeg,
          description: form.description,
          imageUrl: form.imageUrl || undefined,
        });
        toast.success("Menu item added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save menu item");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Menu Items</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="text-white font-body"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              onClick={openAdd}
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-ocid="admin.dialog">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editId ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1">
                <Label className="font-body text-sm">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Item name"
                  className="font-body"
                  data-ocid="admin.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="font-body text-sm">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setField("category", v as MenuCategory)
                    }
                  >
                    <SelectTrigger
                      className="font-body"
                      data-ocid="admin.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((o) => (
                        <SelectItem
                          key={o.value}
                          value={o.value}
                          className="font-body"
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Price (₹) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="e.g. 250"
                    className="font-body"
                    data-ocid="admin.input"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isVeg}
                    onCheckedChange={(v) => setField("isVeg", v)}
                    data-ocid="admin.switch"
                  />
                  <Label className="font-body text-sm">Vegetarian</Label>
                </div>
                {editId && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.isAvailable}
                      onCheckedChange={(v) => setField("isAvailable", v)}
                      data-ocid="admin.switch"
                    />
                    <Label className="font-body text-sm">Available</Label>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="font-body resize-none h-16"
                  data-ocid="admin.textarea"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  placeholder="https://..."
                  className="font-body"
                  data-ocid="admin.input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 text-white font-body"
                  style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                  onClick={handleSave}
                  disabled={addItem.isPending || updateItem.isPending}
                  data-ocid="admin.save_button"
                >
                  {addItem.isPending || updateItem.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editId ? "Update" : "Add Item"}
                </Button>
                <Button
                  variant="outline"
                  className="font-body"
                  onClick={() => setDialogOpen(false)}
                  data-ocid="admin.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !menuItems || menuItems.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          <p className="font-body">No menu items yet. Add your first item!</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Name</TableHead>
                <TableHead className="font-body">Category</TableHead>
                <TableHead className="font-body">Price</TableHead>
                <TableHead className="font-body">Type</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item, idx) => (
                <TableRow
                  key={String(item.id)}
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <TableCell className="font-body text-sm font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">
                    {item.category}
                  </TableCell>
                  <TableCell className="font-body text-sm">
                    ₹{String(item.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: item.isVeg ? "#22c55e" : "#ef4444",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.isAvailable ? "default" : "secondary"}
                      className="font-body text-xs"
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                        onClick={() => openEdit(item)}
                        data-ocid={`admin.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                        data-ocid={`admin.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

function OrdersManagement() {
  const { data: orders, isLoading, refetch } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (id: bigint, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order status updated");
      if (status === OrderStatus.delivered) {
        const reviewMsg =
          "Your order from Little Village Restaurant has been delivered. We hope you enjoyed your meal!\n\nPlease leave a review: https://g.page/littlevillagerestaurant/review";
        const waUrl = `https://wa.me/?text=${encodeURIComponent(reviewMsg)}`;
        window.open(waUrl, "_blank");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Orders</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="font-body"
          data-ocid="admin.button"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground px-4"
          data-ocid="admin.empty_state"
        >
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-body font-medium text-base mb-2">No orders yet</p>
          <p className="font-body text-sm max-w-md mx-auto">
            No orders have been placed through the app yet. Orders placed via
            the online ordering system will appear here. Customers using the
            WhatsApp order button send messages directly to{" "}
            <span className="font-semibold">+91 90100 38444</span> — those can
            also be tracked here once submitted through the checkout flow.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-auto">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">ID</TableHead>
                <TableHead className="font-body">Customer</TableHead>
                <TableHead className="font-body">Items</TableHead>
                <TableHead className="font-body">Total</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={String(order.id)}
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <TableCell className="font-body text-sm text-muted-foreground">
                    #{String(order.id)}
                  </TableCell>
                  <TableCell className="font-body text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.phone}
                    </p>
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground max-w-xs">
                    {order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                  </TableCell>
                  <TableCell className="font-body text-sm font-semibold">
                    ₹{String(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-xs font-semibold font-body px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${ORDER_STATUS_LABELS[order.status].color}20`,
                        color: ORDER_STATUS_LABELS[order.status].color,
                      }}
                    >
                      {ORDER_STATUS_LABELS[order.status].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(v) =>
                        handleStatusChange(order.id, v as OrderStatus)
                      }
                    >
                      <SelectTrigger
                        className="w-32 h-8 font-body text-xs"
                        data-ocid={`admin.select.${idx + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="font-body text-xs"
                          >
                            {ORDER_STATUS_LABELS[s].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

function ReservationsManagement() {
  const { data: reservations, isLoading, refetch } = useAllReservations();
  const updateStatus = useUpdateReservationStatus();

  const handleStatus = async (id: bigint, status: ReservationStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Reservation ${status}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Reservations</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="font-body"
          data-ocid="admin.button"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !reservations || reservations.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground px-4"
          data-ocid="admin.empty_state"
        >
          <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-body font-medium text-base mb-2">
            No reservations yet
          </p>
          <p className="font-body text-sm max-w-md mx-auto">
            No table bookings have been submitted through the app yet. When
            customers complete the reservation form on the Reservations page,
            their bookings will appear here for you to confirm or manage.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-auto">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Name</TableHead>
                <TableHead className="font-body">Date / Time</TableHead>
                <TableHead className="font-body">Guests</TableHead>
                <TableHead className="font-body">Phone</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((res, idx) => (
                <TableRow
                  key={String(res.id)}
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <TableCell className="font-body text-sm font-medium">
                    {res.name}
                  </TableCell>
                  <TableCell className="font-body text-sm">
                    <p>{res.date}</p>
                    <p className="text-xs text-muted-foreground">{res.time}</p>
                  </TableCell>
                  <TableCell className="font-body text-sm">
                    {String(res.guests)}
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">
                    {res.phone}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-xs font-semibold font-body px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${RESERVATION_STATUS_LABELS[res.status].color}20`,
                        color: RESERVATION_STATUS_LABELS[res.status].color,
                      }}
                    >
                      {RESERVATION_STATUS_LABELS[res.status].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {res.status === ReservationStatus.pending && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 text-xs text-white font-body"
                            style={{ backgroundColor: "oklch(0.55 0.15 140)" }}
                            onClick={() =>
                              handleStatus(res.id, ReservationStatus.confirmed)
                            }
                            data-ocid={`admin.confirm_button.${idx + 1}`}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs font-body text-destructive"
                            onClick={() =>
                              handleStatus(res.id, ReservationStatus.cancelled)
                            }
                            data-ocid={`admin.delete_button.${idx + 1}`}
                          >
                            <XCircle className="w-3 h-3 mr-1" /> Cancel
                          </Button>
                        </>
                      )}
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

function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-12"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: "Orders Today",
      value: analytics ? String(analytics.totalOrdersToday) : "0",
      color: "oklch(0.35 0.14 29)",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Revenue Today",
      value: analytics ? `₹${String(analytics.totalRevenueToday)}` : "₹0",
      color: "oklch(0.55 0.15 140)",
    },
    {
      icon: <CalendarDays className="w-6 h-6" />,
      label: "Reservations",
      value: analytics ? String(analytics.totalReservations) : "0",
      color: "oklch(0.60 0.15 220)",
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      label: "Popular Dishes",
      value: analytics ? String(analytics.popularDishes.length) : "0",
      color: "oklch(0.73 0.15 83)",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl bg-card border border-border shadow-warm"
            data-ocid="admin.card"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${s.color}18`, color: s.color }}
            >
              {s.icon}
            </div>
            <p className="text-2xl font-bold font-body text-card-foreground">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {analytics && analytics.popularDishes.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-display font-semibold text-base mb-4">
            Popular Dishes
          </h4>
          <div className="space-y-2">
            {analytics.popularDishes.slice(0, 10).map((dish, idx) => (
              <div
                key={String(dish.itemId)}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                data-ocid={`admin.item.${idx + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-body text-sm">{dish.name}</span>
                </div>
                <span className="text-xs text-muted-foreground font-body">
                  {String(dish.orderCount)} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
        className="w-full text-white font-body"
        style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
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

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-8">
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "oklch(0.35 0.14 29 / 0.1)" }}
              >
                <UtensilsCrossed
                  className="w-8 h-8"
                  style={{ color: "oklch(0.35 0.14 29)" }}
                />
              </div>
              <h1 className="font-display text-2xl font-bold text-card-foreground">
                Admin Login
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-2">
                Little Village Restaurant Management
              </p>
            </div>

            <Button
              className="w-full h-12 text-white font-body font-semibold"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
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

  // Not admin -- show setup form
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div
            className="bg-card rounded-2xl shadow-warm-lg border border-border p-8"
            data-ocid="admin.error_state"
          >
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "oklch(0.55 0.20 20 / 0.1)" }}
              >
                <KeyRound
                  className="w-8 h-8"
                  style={{ color: "oklch(0.55 0.20 20)" }}
                />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Admin Setup Required
              </h2>
              <p className="text-muted-foreground font-body text-sm mt-2">
                Your account needs to be verified as admin. Enter the admin
                token to claim access.
              </p>
            </div>

            {!showSetup ? (
              <div className="space-y-3">
                <Button
                  className="w-full text-white font-body"
                  style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
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

  // Admin dashboard
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div
        className="py-8 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.14 29) 0%, oklch(0.25 0.09 40) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-white/60 font-body text-sm mt-1">
                Little Village Restaurant Management
              </p>
            </div>
            <div
              className="text-right text-xs font-body"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              <p>Logged in as</p>
              <p className="font-mono text-white/50">
                {identity.getPrincipal().toString().slice(0, 12)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="overview" data-ocid="admin.tab">
          <div className="overflow-x-auto mb-8">
            <TabsList className="font-body flex-wrap h-auto gap-1 w-full min-w-max">
              <TabsTrigger
                value="overview"
                className="font-body"
                data-ocid="admin.tab"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="menu"
                className="font-body"
                data-ocid="admin.tab"
              >
                <UtensilsCrossed className="w-4 h-4 mr-1" />
                Menu
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="font-body"
                data-ocid="admin.tab"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="font-body"
                data-ocid="admin.tab"
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                Reservations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
          <TabsContent value="reservations">
            <ReservationsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
