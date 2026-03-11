import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Award, Heart, Leaf, Users } from "lucide-react";
import { motion } from "motion/react";

const GALLERY_ITEMS = [
  {
    src: "/assets/generated/restaurant-interior.dim_800x500.jpg",
    alt: "Restaurant dining hall",
  },
  {
    src: "/assets/generated/featured-biryani.dim_600x400.jpg",
    alt: "Chicken Dum Biryani",
  },
  {
    src: "/assets/generated/featured-curry.dim_600x400.jpg",
    alt: "Andhra Curry",
  },
  {
    src: "/assets/generated/featured-starter.dim_600x400.jpg",
    alt: "Paneer Tikka",
  },
  {
    src: "/assets/generated/restaurant-interior.dim_800x500.jpg",
    alt: "Private dining room",
  },
  {
    src: "/assets/generated/hero-banner.dim_1600x900.jpg",
    alt: "Restaurant ambiance",
  },
];

const VALUES = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Cooked with Love",
    desc: "Every dish is prepared with care, using recipes passed down through generations of Andhra families.",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Fresh Ingredients",
    desc: "We source the finest local produce — from farm-fresh vegetables to quality meats and spices.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Family Friendly",
    desc: "Our spacious restaurant welcomes families of all sizes. Children are always welcome!",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Award Winning",
    desc: "Rated 4.1★ by over 11,540 diners on Google. We're proud of every review.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/restaurant-interior.dim_800x500.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "oklch(0.10 0.04 29 / 0.70)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4"
        >
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            Who We Are
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
            Our Story
          </h1>
        </motion.div>
      </section>

      {/* Story Section */}
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
              Est. in Mangalagiri
            </p>
            <h2 className="heading-lg section-title text-foreground mb-6">
              Little Village Restaurant
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                Born from a deep passion for authentic Telugu cuisine, Little
                Village Restaurant was founded with one simple mission: to bring
                the bold, earthy, and vibrant flavors of Andhra Pradesh to every
                plate we serve.
              </p>
              <p>
                Located on Service Road in Mangalagiri, we\'ve become a beloved
                dining destination for locals and visitors alike. Our name
                reflects our roots — the warmth of a small village, the
                generosity of home-cooked food, and the pride of Andhra culture.
              </p>
              <p>
                What started as a modest family restaurant has grown into a
                spacious, full-service dining experience — with over 11,540
                Google reviews and a loyal community of food lovers who return
                again and again.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="/assets/generated/restaurant-interior.dim_800x500.jpg"
              alt="Inside Little Village Restaurant"
              className="w-full h-80 object-cover rounded-2xl shadow-warm-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Chef Philosophy */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.96 0.012 75)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            Our Kitchen
          </p>
          <h2 className="heading-lg section-title-center text-foreground mb-8">
            Chef\'s Philosophy
          </h2>
          <div
            className="p-8 rounded-2xl relative"
            style={{
              backgroundColor: "white",
              borderLeft: "4px solid oklch(0.73 0.15 83)",
            }}
          >
            <span
              className="font-display text-6xl absolute -top-4 left-6"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              &ldquo;
            </span>
            <p className="text-lg text-muted-foreground font-body leading-relaxed italic mt-6">
              Andhra cuisine is not just food — it is emotion. Every curry tells
              a story, every spice carries a memory. At Little Village, we honor
              the ancient art of Telugu cooking while keeping it accessible to
              everyone. Whether it\'s the fire of a Guntur chilli or the
              sourness of Gongura, we want every guest to feel the soul of
              Andhra in every bite.
            </p>
            <p
              className="mt-6 font-semibold font-body"
              style={{ color: "oklch(0.35 0.14 29)" }}
            >
              — Head Chef, Little Village Restaurant
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <p
            className="text-sm uppercase tracking-widest font-body mb-2"
            style={{ color: "oklch(0.73 0.15 83)" }}
          >
            A Look Inside
          </p>
          <h2 className="heading-lg section-title-center text-foreground">
            Our Gallery
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.alt + String(i)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="overflow-hidden rounded-xl aspect-video shadow-warm group"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm uppercase tracking-widest font-body mb-2"
              style={{ color: "oklch(0.73 0.15 83)" }}
            >
              What Drives Us
            </p>
            <h2 className="heading-lg text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl"
                style={{ backgroundColor: "oklch(1 0 0 / 0.06)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: "oklch(0.73 0.15 83 / 0.15)",
                    color: "oklch(0.73 0.15 83)",
                  }}
                >
                  {v.icon}
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-2">
                  {v.title}
                </h3>
                <p
                  className="text-xs font-body"
                  style={{ color: "oklch(0.85 0.05 75)" }}
                >
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-4">
        <h2 className="heading-lg text-foreground mb-4">
          Ready to Dine With Us?
        </h2>
        <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
          Book a table or explore our menu. We look forward to serving you.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/reservations" data-ocid="about.primary_button">
            <Button
              size="lg"
              className="text-white font-body font-semibold"
              style={{ backgroundColor: "oklch(0.35 0.14 29)" }}
            >
              Reserve a Table
            </Button>
          </Link>
          <Link to="/menu" data-ocid="about.secondary_button">
            <Button
              size="lg"
              variant="outline"
              className="font-body font-semibold border-2"
              style={{
                borderColor: "oklch(0.35 0.14 29)",
                color: "oklch(0.35 0.14 29)",
              }}
            >
              Explore Menu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
