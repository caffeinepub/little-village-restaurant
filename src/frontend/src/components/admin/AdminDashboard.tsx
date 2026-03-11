import {
  CalendarDays,
  Loader2,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAllMenuItems, useAnalytics } from "../../hooks/useQueries";
import AdminStatCard from "./AdminStatCard";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOCK_ORDERS = [4, 7, 5, 9, 12, 15, 11];
const barData = DAYS.map((day, i) => ({ day, orders: MOCK_ORDERS[i] }));

const PIE_COLORS = [
  "oklch(0.35 0.14 29)",
  "oklch(0.73 0.15 83)",
  "oklch(0.55 0.15 140)",
  "oklch(0.60 0.15 220)",
  "oklch(0.55 0.18 300)",
];

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: menuItems } = useAllMenuItems();

  const pieData =
    analytics?.popularDishes.slice(0, 5).map((d) => ({
      name: d.name,
      value: Number(d.orderCount),
    })) ?? [];

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
      label: "Menu Items",
      value: String(menuItems?.length ?? 0),
      color: "oklch(0.73 0.15 83)",
    },
  ];

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-16"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <AdminStatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <div className="bg-card rounded-xl border border-border shadow-warm p-5">
          <h3 className="font-display font-semibold text-base mb-4 section-title">
            Orders Overview (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={barData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.85 0.01 60)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fontFamily: "var(--font-body)" }}
              />
              <YAxis tick={{ fontSize: 12, fontFamily: "var(--font-body)" }} />
              <Tooltip
                contentStyle={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.85 0.01 60)",
                }}
              />
              <Bar
                dataKey="orders"
                fill="oklch(0.35 0.14 29)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-card rounded-xl border border-border shadow-warm p-5">
          <h3 className="font-display font-semibold text-base mb-4 section-title">
            Top Menu Items
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-muted-foreground font-body text-sm">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Popular dishes */}
      {analytics && analytics.popularDishes.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-warm overflow-hidden">
          <div
            className="h-1 w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, oklch(0.35 0.14 29), oklch(0.73 0.15 83))",
            }}
          />
          <div className="p-5">
            <h3 className="font-display font-semibold text-base section-title mb-5">
              Popular Dishes
            </h3>
            <div className="space-y-1">
              {analytics.popularDishes.slice(0, 8).map((dish, idx) => (
                <div
                  key={String(dish.itemId)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/20 transition-colors border-l-4"
                  style={{ borderLeftColor: "oklch(0.73 0.15 83)" }}
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.35 0.14 29), oklch(0.28 0.12 20))",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-body text-sm font-medium">
                      {dish.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold font-body px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.35 0.14 29 / 0.10)",
                      color: "oklch(0.35 0.14 29)",
                    }}
                  >
                    {String(dish.orderCount)} orders
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
