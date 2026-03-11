import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend.d";
import { useAllOrders, useUpdateOrderStatus } from "../../hooks/useQueries";

const STATUS_OPTIONS = [
  {
    value: OrderStatus.pending,
    label: "Pending",
    color: "oklch(0.73 0.15 83)",
  },
  {
    value: OrderStatus.preparing,
    label: "Preparing",
    color: "oklch(0.60 0.15 220)",
  },
  { value: OrderStatus.ready, label: "Ready", color: "oklch(0.55 0.15 140)" },
  {
    value: OrderStatus.delivered,
    label: "Delivered",
    color: "oklch(0.50 0.10 140)",
  },
];

const PAGE_SIZE = 15;

interface AdminOrdersProps {
  searchQuery?: string;
}

export default function AdminOrders({ searchQuery = "" }: AdminOrdersProps) {
  const { data: rawOrders, isLoading, refetch } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [page, setPage] = useState(1);

  const handleStatusChange = async (
    orderId: bigint,
    newStatus: OrderStatus,
    phone: string,
  ) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success("Order status updated");

      if (newStatus === OrderStatus.delivered) {
        const reviewLink = "https://g.page/r/CdV5YOzX8NICEAE/review";
        const message = `Your order from Little Village Restaurant has been delivered! 🍽️\n\nWe hope you enjoyed the meal.\n\nPlease leave us a review: ${reviewLink}\n\nThank you for dining with us! 🙏`;
        const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const sendWhatsApp = (phone: string, customerName: string) => {
    const message = `Hello ${customerName}! Thank you for ordering from Little Village Restaurant. 🍽️`;
    const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const orders = (rawOrders ?? []).filter(
    (o) =>
      !searchQuery ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery),
  );

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageOrders = orders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const statusInfo = (s: OrderStatus) =>
    STATUS_OPTIONS.find((o) => o.value === s) ?? STATUS_OPTIONS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted-foreground font-body">
          {orders.length} orders found
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
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
      ) : orders.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.35 0.14 29 / 0.08)" }}
          >
            <ShoppingBag
              className="w-8 h-8"
              style={{ color: "oklch(0.35 0.14 29)" }}
            />
          </div>
          <p className="font-body font-medium text-base mb-1">No orders yet</p>
          <p className="font-body text-sm">
            Orders placed through the app will appear here.
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
                  <TableHead className="font-body font-semibold">#</TableHead>
                  <TableHead className="font-body font-semibold">
                    Customer
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Items
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Total
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Update
                  </TableHead>
                  <TableHead className="font-body font-semibold">WA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageOrders.map((order, idx) => {
                  const info = statusInfo(order.status);
                  return (
                    <TableRow
                      key={String(order.id)}
                      data-ocid={`admin.row.${idx + 1}`}
                      className={idx % 2 === 1 ? "bg-muted/20" : ""}
                    >
                      <TableCell className="font-body text-xs text-muted-foreground">
                        #{String(order.id)}
                      </TableCell>
                      <TableCell className="font-body text-sm">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.phone}
                        </p>
                      </TableCell>
                      <TableCell className="font-body text-xs text-muted-foreground max-w-[200px]">
                        <p className="truncate">
                          {order.items
                            .map((i) => `${i.name} x${String(i.qty)}`)
                            .join(", ")}
                        </p>
                      </TableCell>
                      <TableCell className="font-body text-sm font-semibold">
                        ₹{String(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-xs font-semibold font-body px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${info.color}20`,
                            color: info.color,
                          }}
                        >
                          {info.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            handleStatusChange(
                              order.id,
                              v as OrderStatus,
                              order.phone,
                            )
                          }
                        >
                          <SelectTrigger
                            className="h-8 w-32 text-xs font-body"
                            data-ocid={`admin.select.${idx + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem
                                key={s.value}
                                value={s.value}
                                className="font-body text-xs"
                              >
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            sendWhatsApp(order.phone, order.customerName)
                          }
                        >
                          <MessageCircle
                            className="w-4 h-4"
                            style={{ color: "oklch(0.55 0.15 140)" }}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

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
