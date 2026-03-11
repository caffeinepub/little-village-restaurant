import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Reservation } from "../../backend.d";
import { ReservationStatus } from "../../backend.d";
import {
  useAllReservations,
  useUpdateReservationStatus,
} from "../../hooks/useQueries";

const STATUS_LABELS: Record<
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

const PAGE_SIZE = 15;

export default function AdminReservations() {
  const { data: rawReservations, isLoading, refetch } = useAllReservations();
  const updateStatus = useUpdateReservationStatus();
  const [page, setPage] = useState(1);

  const handleStatus = async (
    id: bigint,
    status: ReservationStatus,
    res?: Reservation,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(
        status === ReservationStatus.confirmed
          ? "Reservation confirmed"
          : "Reservation cancelled",
      );
      if (status === ReservationStatus.confirmed && res) {
        const message = `Hello ${res.name}! Your reservation at Little Village Restaurant on ${res.date} at ${res.time} for ${String(res.guests)} guests has been confirmed. We look forward to welcoming you! 🍽️`;
        const url = `https://wa.me/${res.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
      }
    } catch {
      toast.error("Failed to update reservation");
    }
  };

  const reservations = rawReservations ?? [];
  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRes = reservations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted-foreground font-body">
          {reservations.length} reservations total
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
      ) : reservations.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.35 0.14 29 / 0.08)" }}
          >
            <CalendarDays
              className="w-8 h-8"
              style={{ color: "oklch(0.35 0.14 29)" }}
            />
          </div>
          <p className="font-body font-medium text-base mb-1">
            No reservations yet
          </p>
          <p className="font-body text-sm">
            Table bookings will appear here when customers reserve.
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
                    Phone
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Date / Time
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Guests
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
                {pageRes.map((res, idx) => {
                  const info = STATUS_LABELS[res.status];
                  return (
                    <TableRow
                      key={String(res.id)}
                      data-ocid={`admin.row.${idx + 1}`}
                      className={idx % 2 === 1 ? "bg-muted/20" : ""}
                    >
                      <TableCell className="font-body text-sm font-medium">
                        {res.name}
                      </TableCell>
                      <TableCell className="font-body text-sm text-muted-foreground">
                        {res.phone}
                      </TableCell>
                      <TableCell className="font-body text-sm">
                        <p>{res.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {res.time}
                        </p>
                      </TableCell>
                      <TableCell className="font-body text-sm">
                        {String(res.guests)}
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
                        <div className="flex gap-2">
                          {res.status === ReservationStatus.pending && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 text-xs text-white font-body"
                                style={{
                                  backgroundColor: "oklch(0.55 0.15 140)",
                                }}
                                onClick={() =>
                                  handleStatus(
                                    res.id,
                                    ReservationStatus.confirmed,
                                    res,
                                  )
                                }
                                data-ocid={`admin.confirm_button.${idx + 1}`}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs font-body text-destructive"
                                onClick={() =>
                                  handleStatus(
                                    res.id,
                                    ReservationStatus.cancelled,
                                  )
                                }
                                data-ocid={`admin.delete_button.${idx + 1}`}
                              >
                                <XCircle className="w-3 h-3 mr-1" /> Cancel
                              </Button>
                            </>
                          )}
                          {res.status === ReservationStatus.confirmed && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-body text-destructive"
                              onClick={() =>
                                handleStatus(
                                  res.id,
                                  ReservationStatus.cancelled,
                                )
                              }
                              data-ocid={`admin.delete_button.${idx + 1}`}
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Cancel
                            </Button>
                          )}
                        </div>
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
