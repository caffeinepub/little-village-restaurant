import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, CheckCircle2, Clock, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateReservation } from "../hooks/useQueries";

const TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
];

const GUEST_COUNTS = Array.from({ length: 20 }, (_, i) => i + 1);

type FormState = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  specialRequest: string;
};

export default function ReservationsPage() {
  const createReservation = useCreateReservation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    specialRequest: "",
  });

  const setField = (field: keyof FormState, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createReservation.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        guests: Number.parseInt(form.guests),
        specialRequest: form.specialRequest || undefined,
      });
    } catch {
      // Backend may not be ready, proceed
    }

    // Open WhatsApp with reservation details
    const msg = [
      "*Table Reservation Request*",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Date: ${form.date}`,
      `Time: ${form.time}`,
      `Guests: ${form.guests}`,
      form.specialRequest ? `Special Request: ${form.specialRequest}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/919010038444?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setSubmitted(true);
    toast.success("Reservation request sent!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
          data-ocid="reservation.success_state"
        >
          <CheckCircle2
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "oklch(0.55 0.14 140)" }}
          />
          <h2 className="heading-lg text-foreground mb-4">
            Reservation Requested!
          </h2>
          <p className="text-muted-foreground font-body mb-6 leading-relaxed">
            Your reservation details have been sent via WhatsApp. We will
            confirm your booking shortly.
          </p>
          <div
            className="p-4 rounded-xl mb-8"
            style={{ backgroundColor: "oklch(0.96 0.012 75)" }}
          >
            <p className="font-body text-sm">
              <strong>{form.name}</strong> • {form.date} • {form.time} •{" "}
              {form.guests} guests
            </p>
          </div>
          <Button
            onClick={() => setSubmitted(false)}
            className="text-white font-body"
            style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
            data-ocid="reservation.button"
          >
            Make Another Reservation
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="pt-24 pb-12 px-4 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.35 0.14 29) 0%, oklch(0.25 0.09 40) 100%)",
        }}
      >
        <p
          className="text-sm uppercase tracking-widest font-body mb-2"
          style={{ color: "oklch(0.73 0.15 83)" }}
        >
          Book Your Table
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
          Reservations
        </h1>
        <p className="text-white/70 font-body max-w-md mx-auto">
          Reserve your table at Little Village Restaurant and enjoy a memorable
          dining experience.
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-warm border border-border p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-card-foreground mb-6">
                Book a Table
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="res-name" className="font-body text-sm">
                      Full Name *
                    </Label>
                    <Input
                      id="res-name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      required
                      data-ocid="reservation.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="res-phone" className="font-body text-sm">
                      Phone Number *
                    </Label>
                    <Input
                      id="res-phone"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      required
                      data-ocid="reservation.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="res-email" className="font-body text-sm">
                    Email Address *
                  </Label>
                  <Input
                    id="res-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                    data-ocid="reservation.input"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="res-date" className="font-body text-sm">
                      <CalendarDays className="w-4 h-4 inline mr-1" />
                      Date *
                    </Label>
                    <Input
                      id="res-date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      required
                      data-ocid="reservation.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="res-time" className="font-body text-sm">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time *
                    </Label>
                    <Select
                      value={form.time}
                      onValueChange={(v) => setField("time", v)}
                    >
                      <SelectTrigger
                        id="res-time"
                        data-ocid="reservation.select"
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t} className="font-body">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="res-guests" className="font-body text-sm">
                    <Users className="w-4 h-4 inline mr-1" />
                    Number of Guests *
                  </Label>
                  <Select
                    value={form.guests}
                    onValueChange={(v) => setField("guests", v)}
                  >
                    <SelectTrigger
                      id="res-guests"
                      data-ocid="reservation.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_COUNTS.map((n) => (
                        <SelectItem
                          key={n}
                          value={String(n)}
                          className="font-body"
                        >
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="res-request" className="font-body text-sm">
                    Special Requests
                  </Label>
                  <Textarea
                    id="res-request"
                    placeholder="Any dietary requirements, seating preferences, or special occasions..."
                    value={form.specialRequest}
                    onChange={(e) => setField("specialRequest", e.target.value)}
                    className="font-body resize-none h-24"
                    data-ocid="reservation.textarea"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white font-body font-semibold h-12"
                  style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                  disabled={createReservation.isPending}
                  data-ocid="reservation.submit_button"
                >
                  {createReservation.isPending
                    ? "Submitting..."
                    : "Request Reservation via WhatsApp"}
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-5">
            <div className="bg-card rounded-2xl shadow-warm border border-border p-6">
              <h3
                className="font-display font-semibold text-lg mb-4"
                style={{ color: "oklch(0.35 0.14 29)" }}
              >
                Restaurant Info
              </h3>
              <div className="space-y-4 text-sm font-body">
                <div>
                  <p className="font-semibold text-card-foreground">Address</p>
                  <p className="text-muted-foreground">
                    Service Road, Mangalagiri
                    <br />
                    Chinnakakani, AP 522508
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">Phone</p>
                  <a
                    href="tel:+919010038444"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    090100 38444
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">
                    Opening Hours
                  </p>
                  <p className="text-muted-foreground">
                    Open Daily • Closes 11:30 PM
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 text-white"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
            >
              <h3 className="font-display font-semibold text-lg mb-3">
                Private Dining
              </h3>
              <p className="text-sm font-body text-white/80 mb-4">
                Planning a special event? We have a private dining room
                available for birthdays, anniversaries, corporate lunches, and
                family celebrations.
              </p>
              <a
                href="https://wa.me/919010038444?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20the%20private%20dining%20room."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold font-body underline"
                style={{ color: "oklch(0.73 0.15 83)" }}
              >
                Enquire via WhatsApp →
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-base text-card-foreground mb-3">
                Important Notes
              </h3>
              <ul className="space-y-2">
                {[
                  "Reservations are subject to availability",
                  "Please arrive within 15 mins of booking time",
                  "For groups > 10, call us directly",
                  "Holi & major holidays: call to confirm",
                ].map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 text-xs text-muted-foreground font-body"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: "oklch(0.73 0.15 83)" }}
                    />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
