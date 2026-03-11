import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AdminStatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}

export default function AdminStatCard({
  icon,
  label,
  value,
  color,
  delay = 0,
}: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      className="hover-lift rounded-xl bg-card border border-border shadow-warm overflow-hidden"
      data-ocid="admin.card"
    >
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}28`, color }}
        >
          {icon}
        </div>
        <p className="text-3xl font-bold font-body text-card-foreground leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground font-body mt-2">{label}</p>
      </div>
    </motion.div>
  );
}
