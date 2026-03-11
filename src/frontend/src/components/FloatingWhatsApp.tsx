import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919010038444"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-warm-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
      data-ocid="nav.button"
    >
      <MessageCircle className="w-5 h-5 text-white fill-white" />
      <span className="text-white text-sm font-semibold font-body hidden sm:inline group-hover:inline transition-all">
        Chat with us
      </span>
    </a>
  );
}
