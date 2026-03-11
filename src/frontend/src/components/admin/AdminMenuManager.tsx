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
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { MenuCategory } from "../../backend.d";
import {
  useAddMenuItem,
  useAllMenuItems,
  useDeleteMenuItem,
  useUpdateMenuItem,
} from "../../hooks/useQueries";

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

const PAGE_SIZE = 10;

interface AdminMenuManagerProps {
  searchQuery?: string;
}

export default function AdminMenuManager({
  searchQuery = "",
}: AdminMenuManagerProps) {
  const { data: rawItems, isLoading } = useAllMenuItems();
  const addItem = useAddMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [form, setForm] = useState<MenuItemForm>(DEFAULT_FORM);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const setField = <K extends keyof MenuItemForm>(
    key: K,
    val: MenuItemForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(DEFAULT_FORM);
  };

  const openEdit = (item: NonNullable<typeof rawItems>[0]) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      isVeg: item.isVeg,
      description: item.description,
      imageUrl: item.imageUrl?.[0] ?? "",
      isAvailable: item.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    try {
      if (editId !== null) {
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

  // Filter
  const menuItems = (rawItems ?? []).filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(menuItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageItems = menuItems.slice(startIdx, startIdx + PAGE_SIZE);

  const categoryLabel = (cat: MenuCategory) =>
    CATEGORY_OPTIONS.find((o) => o.value === cat)?.label ?? cat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Category filter */}
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            className="w-full sm:w-52 font-body"
            data-ocid="admin.select"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-body">
              All Categories
            </SelectItem>
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="font-body">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile search (desktop is in navbar) */}
        <div className="relative flex-1 md:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 font-body"
            placeholder="Search items..."
            value={searchQuery}
            readOnly
            data-ocid="admin.search_input"
          />
        </div>

        <div className="sm:ml-auto">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="text-white font-body font-semibold shadow-warm hover:shadow-warm-lg transition-all px-5"
                style={{
                  backgroundColor: "oklch(0.35 0.14 29)",
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
                }}
                onClick={openAdd}
                data-ocid="admin.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </DialogTrigger>

            <DialogContent
              className="max-w-md ornamental-border"
              data-ocid="admin.dialog"
            >
              <DialogHeader>
                <p className="text-xs font-body tracking-widest uppercase text-gold font-semibold">
                  Little Village Restaurant
                </p>
                <DialogTitle className="font-display text-xl">
                  {editId ? "Edit Menu Item" : "Add Menu Item"}
                </DialogTitle>
                <div className="gold-divider mt-2" />
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
                    className="flex-1 text-white font-body font-semibold shadow-warm"
                    style={{
                      backgroundColor: "oklch(0.35 0.14 29)",
                      backgroundImage:
                        "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
                    }}
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
                    className="font-body border-gold text-crimson hover:bg-accent/10"
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
      </div>

      {/* Item count */}
      <p className="text-xs text-muted-foreground font-body mb-3">
        Showing {startIdx + 1}–
        {Math.min(startIdx + PAGE_SIZE, menuItems.length)} of {menuItems.length}{" "}
        items
      </p>

      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : menuItems.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.35 0.14 29 / 0.08)" }}
          >
            <UtensilsCrossed
              className="w-8 h-8"
              style={{ color: "oklch(0.35 0.14 29)" }}
            />
          </div>
          <p className="font-body font-medium text-base mb-1">No items found</p>
          <p className="font-body text-sm">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-warm">
          <div className="overflow-x-auto">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow
                  style={{ backgroundColor: "oklch(0.35 0.14 29 / 0.06)" }}
                >
                  <TableHead className="font-body font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((item, idx) => (
                  <TableRow
                    key={String(item.id)}
                    data-ocid={`admin.row.${idx + 1}`}
                    className={idx % 2 === 1 ? "bg-muted/20" : ""}
                  >
                    <TableCell className="font-body text-sm font-medium max-w-[180px] truncate">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {categoryLabel(item.category)}
                    </TableCell>
                    <TableCell className="font-body text-sm font-semibold">
                      ₹{String(item.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs font-body"
                        style={{
                          color: item.isVeg
                            ? "oklch(0.55 0.15 140)"
                            : "oklch(0.55 0.18 30)",
                          borderColor: item.isVeg
                            ? "oklch(0.55 0.15 140)"
                            : "oklch(0.55 0.18 30)",
                        }}
                      >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-xs font-semibold font-body px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: item.isAvailable
                            ? "oklch(0.55 0.15 140 / 0.12)"
                            : "oklch(0.50 0.05 0 / 0.10)",
                          color: item.isAvailable
                            ? "oklch(0.45 0.15 140)"
                            : "oklch(0.50 0.05 0)",
                        }}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(item)}
                          data-ocid={`admin.edit_button.${idx + 1}`}
                        >
                          <Pencil
                            className="w-3.5 h-3.5"
                            style={{ color: "oklch(0.60 0.15 220)" }}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(item.id)}
                          data-ocid={`admin.delete_button.${idx + 1}`}
                        >
                          <Trash2
                            className="w-3.5 h-3.5"
                            style={{ color: "oklch(0.55 0.20 20)" }}
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            data-ocid="admin.pagination_prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-body text-muted-foreground">
            Page {safePage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            data-ocid="admin.pagination_next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
