import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Phone,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

const TESTIMONIALS = [
  {
    name: "Ramesh Kumar",
    rating: 5,
    text: "Absolutely the best Andhra biryani I've had outside of home. The Gongura Chicken is out of this world. Come hungry, leave happy!",
    location: "Vijayawada",
  },
  {
    name: "Priya Sharma",
    rating: 5,
    text: "The ambiance is wonderful — spacious and family-friendly. We had the all-you-can-eat lunch and it was incredible value. Authentic Telugu cuisine.",
    location: "Hyderabad",
  },
  {
    name: "Mohammed Akbar",
    rating: 4,
    text: "Excellent restaurant for family gatherings. The non-veg biryanis are fragrant and perfectly spiced. Great service and prompt WhatsApp ordering.",
    location: "Guntur",
  },
  {
    name: "Lakshmi Devi",
    rating: 5,
    text: "We booked the private dining room for our anniversary — perfect setting! The Andhra curries reminded me of my grandmother's cooking. Five stars!",
    location: "Mangalagiri",
  },
];

const FAQS = [
  {
    q: "What are your opening hours?",
    a: "We are open daily from morning until 11:30 PM. Please note that on certain holidays like Holi, hours may vary. WhatsApp us at 090100 38444 to confirm.",
  },
  {
    q: "Do you offer all-you-can-eat?",
    a: "Yes! We offer an all-you-can-eat experience. It is perfect for families and groups who want to try a variety of Andhra and Indian dishes.",
  },
  {
    q: "How do I make a table reservation?",
    a: "You can book a table through our Reservations page or call us at 090100 38444. We recommend booking in advance for weekends and special occasions.",
  },
  {
    q: "Do you have a private dining room?",
    a: "Yes, we have a private dining room available for special occasions, corporate events, and family gatherings. Contact us to check availability.",
  },
  {
    q: "Can I order food online?",
    a: "Absolutely! You can browse our menu on this website, add items to cart, and place your order directly via WhatsApp. We will confirm and prepare your order.",
  },
];

const FEATURED = [
  {
    image: "/assets/generated/featured-biryani.dim_600x400.jpg",
    name: "Chicken Dum Biryani",
    price: 300,
    categoryKey: "biryanisNonVeg",
    id: 161,
    isVeg: false,
    description: "Slow-cooked chicken dum biryani",
  },
  {
    image: "/assets/generated/featured-starter.dim_600x400.jpg",
    name: "Paneer Tikka",
    price: 310,
    categoryKey: "startersVeg",
    id: 17,
    isVeg: true,
    description: "Classic tandoor-grilled paneer",
  },
  {
    image: "/assets/generated/featured-curry.dim_600x400.jpg",
    name: "Kadai Chicken / Butter Chicken",
    price: 340,
    categoryKey: "curriesNonVeg",
    id: 136,
    isVeg: false,
    description: "Rich butter chicken gravy",
  },
];

const SERVICES = [
  {
    icon: "🍽️",
    title: "All You Can Eat",
    desc: "Unlimited Andhra & Indian cuisine for the whole family",
  },
  {
    icon: "🏠",
    title: "Private Dining",
    desc: "Exclusive private room for special occasions",
  },
  {
    icon: "🎉",
    title: "Happy Hour Food",
    desc: "Special discounts on selected dishes",
  },
  {
    icon: "📱",
    title: "Online Ordering",
    desc: "Order via WhatsApp — fast and easy",
  },
  {
    icon: "📅",
    title: "Table Reservations",
    desc: "Book your table in advance online",
  },
  {
    icon: "🌶️",
    title: "Authentic Andhra",
    desc: "Genuine recipes from the heart of Andhra Pradesh",
  },
];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAddFeatured = (dish: (typeof FEATURED)[0]) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      category: dish.categoryKey,
      isVeg: dish.isVeg,
    });
    setIsOpen(true);
  };

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! We'll keep you posted with our latest offers.");
    setEmail("");
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1600x900.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "oklch(0.10 0.04 29 / 0.72)" }}
        />

        {/* Decorative border */}
        <div
          className="absolute inset-4 md:inset-8 border opacity-30 rounded-sm pointer-events-none"
          style={{ borderColor: "oklch(0.73 0.15 83)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] font-body mb-4"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            Authentic Andhra Cuisine
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Little Village
            <span className="block" style={{ color: "oklch(0.73 0.15 83)" }}>
              Restaurant
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-lg md:text-xl font-body max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Traditional provisions are dished up in this spacious, unpretentious
            restaurant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/menu" data-ocid="hero.primary_button">
              <Button
                size="lg"
                className="text-white font-body font-semibold px-8 h-12 shadow-lg"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              >
                View Menu
              </Button>
            </Link>
            <Link to="/menu" data-ocid="hero.primary_button">
              <Button
                size="lg"
                variant="outline"
                className="font-body font-semibold px-8 h-12 border-2 text-white hover:text-white"
                style={{
                  borderColor: "oklch(0.73 0.15 83)",
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                Order Now
              </Button>
            </Link>
            <Link to="/reservations" data-ocid="hero.secondary_button">
              <Button
                size="lg"
                variant="ghost"
                className="font-body font-semibold px-8 h-12 text-white hover:text-white hover:bg-white/20"
              >
                Reserve Table
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        className="py-5 px-4"
        style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Star className="w-5 h-5" />,
              value: "4.1★",
              label: "Rating",
            },
            {
              icon: <Users className="w-5 h-5" />,
              value: "11,540+",
              label: "Reviews",
            },
            {
              icon: <Clock className="w-5 h-5" />,
              value: "11:30 PM",
              label: "Closes At",
            },
            {
              icon: <UtensilsCrossed className="w-5 h-5" />,
              value: "All You Can Eat",
              label: "Buffet Available",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 justify-center"
            >
              <span style={{ color: "oklch(0.73 0.15 83)" }}>{stat.icon}</span>
              <div>
                <p className="font-bold text-white font-body text-sm md:text-base">
                  {stat.value}
                </p>
                <p
                  className="text-xs font-body"
                  style={{ color: "oklch(0.85 0.06 75)" }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-sm uppercase tracking-widest font-body mb-3"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Our Story
            </p>
            <h2 className="heading-lg section-title text-foreground mb-6">
              A Taste of True Andhra
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              Nestled in the heart of Mangalagiri, Little Village Restaurant has
              been serving the rich, bold flavors of authentic Andhra Pradesh
              cuisine. From the tangy Gongura curries to the fragrant biryanis
              slow-cooked in the dum style, every dish is a tribute to Telugu
              culinary heritage.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              Our spacious, family-friendly dining hall welcomes everyone — from
              small families to large celebrations. With an all-you-can-eat
              option, a private dining room, and warm hospitality, we make every
              visit memorable.
            </p>
            <Link to="/about" data-ocid="about.primary_button">
              <Button
                variant="outline"
                className="font-body font-semibold border-2"
                style={{
                  borderColor: "oklch(0.35 0.14 29)",
                  color: "oklch(0.35 0.14 29)",
                }}
              >
                Read Our Story
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2"
              style={{ borderColor: "oklch(0.73 0.15 83 / 0.3)" }}
            />
            <img
              src="/assets/generated/restaurant-interior.dim_800x500.jpg"
              alt="Little Village Restaurant interior"
              className="relative z-10 w-full h-80 object-cover rounded-2xl shadow-warm-lg"
            />
            <div
              className="absolute -bottom-4 -right-4 z-10 rounded-xl px-5 py-3 shadow-warm"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
            >
              <p className="text-white font-bold font-body">4.1 ★</p>
              <p
                className="text-xs font-body"
                style={{ color: "oklch(0.85 0.08 75)" }}
              >
                11,540+ reviews
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED DISHES ── */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.96 0.012 75)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm uppercase tracking-widest font-body mb-2"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Chef\'s Picks
            </p>
            <h2 className="heading-lg section-title-center text-foreground">
              Featured Dishes
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-card rounded-2xl overflow-hidden shadow-warm hover-lift group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span
                    className="absolute top-3 right-3 text-white text-xs font-semibold font-body px-3 py-1 rounded-full"
                    style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                  >
                    ₹{dish.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-1">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    {dish.description}
                  </p>
                  <Button
                    className="w-full text-white font-body font-semibold"
                    style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
                    onClick={() => handleAddFeatured(dish)}
                    data-ocid={`featured.primary_button.${i + 1}`}
                  >
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/menu" data-ocid="featured.primary_button">
              <Button
                size="lg"
                className="text-white font-body font-semibold px-10"
                style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
              >
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            What We Offer
          </p>
          <h2 className="heading-lg section-title-center text-foreground">
            Our Services
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card shadow-warm border border-border text-center hover-lift"
            >
              <span className="text-4xl block mb-3">{s.icon}</span>
              <h3 className="font-display font-semibold text-base text-card-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="py-20 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.14 29) 0%, oklch(0.25 0.09 40) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            What Our Guests Say
          </p>
          <h2 className="heading-lg text-white mb-10">Customer Reviews</h2>

          <div className="relative min-h-52">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-8 rounded-2xl"
                style={{ backgroundColor: "oklch(1 0 0 / 0.08)" }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5]
                    .slice(0, TESTIMONIALS[activeTestimonial].rating)
                    .map((n) => (
                      <Star
                        key={`star-${n}`}
                        className="w-5 h-5 fill-current"
                        style={{ color: "oklch(0.73 0.15 83)" }}
                      />
                    ))}
                </div>
                <p className="text-white/90 font-body text-lg italic leading-relaxed mb-6">
                  &ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;
                </p>
                <div>
                  <p className="text-white font-semibold font-body">
                    {TESTIMONIALS[activeTestimonial].name}
                  </p>
                  <p
                    className="text-sm font-body"
                    style={{ color: "oklch(0.73 0.15 83)" }}
                  >
                    {TESTIMONIALS[activeTestimonial].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((t, i) => (
              <button
                type="button"
                key={t.name}
                onClick={() => setActiveTestimonial(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeTestimonial ? "24px" : "8px",
                  height: "8px",
                  backgroundColor:
                    i === activeTestimonial
                      ? "oklch(0.73 0.15 83)"
                      : "oklch(1 0 0 / 0.3)",
                }}
                data-ocid="testimonials.toggle"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            Got Questions?
          </p>
          <h2 className="heading-lg section-title-center text-foreground">
            FAQs
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border overflow-hidden"
            >
              <button
                type="button"
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-card hover:bg-muted/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                data-ocid={`faq.toggle.${i + 1}`}
              >
                <span className="font-semibold font-body text-sm text-card-foreground">
                  {faq.q}
                </span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 py-4 bg-muted/30 border-t border-border">
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MAP & CONTACT ── */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.96 0.012 75)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm uppercase tracking-widest font-body mb-2"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              Find Us
            </p>
            <h2 className="heading-lg section-title-center text-foreground">
              Location & Contact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl overflow-hidden shadow-warm h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.0!2d80.5726!3d16.4307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLittle%20Village%20Restaurant%2C%20Mangalagiri!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Little Village Restaurant Location"
                data-ocid="map.map_marker"
              />
            </div>
            <div className="space-y-6">
              {[
                {
                  icon: <MapPin className="w-5 h-5" />,
                  title: "Address",
                  content:
                    "Service Road, Mangalagiri\nChinnakakani, Andhra Pradesh 522508",
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  title: "Phone / WhatsApp",
                  content: "090100 38444",
                  href: "tel:+919010038444",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  title: "Opening Hours",
                  content: "Open Daily • Closes at 11:30 PM",
                },
                {
                  icon: <Award className="w-5 h-5" />,
                  title: "Rating",
                  content: "4.1 ★ on Google (11,540+ reviews)",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 rounded-xl bg-card shadow-warm"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "oklch(0.35 0.14 29 / 0.1)",
                      color: "oklch(0.35 0.14 29)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className="font-semibold font-body text-sm mb-0.5"
                      style={{ color: "oklch(0.35 0.14 29)" }}
                    >
                      {item.title}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground font-body hover:text-foreground whitespace-pre-line"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground font-body whitespace-pre-line">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Updated
          </h2>
          <p className="text-white/70 font-body text-sm mb-6">
            Subscribe for special offers, new menu items, and event
            announcements.
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 font-body"
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              data-ocid="newsletter.input"
            />
            <Button
              className="h-11 px-6 font-body font-semibold text-foreground"
              style={{ backgroundColor: "oklch(0.73 0.15 83)" }}
              onClick={handleSubscribe}
              data-ocid="newsletter.submit_button"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
