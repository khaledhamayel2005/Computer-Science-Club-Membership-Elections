import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    fontFamily: { sans: ["Tajawal", "sans-serif"] },
    colors: { ink: "#020817", panel: "#08152d", electric: "#137fec" },
    boxShadow: { glow: "0 0 40px rgba(34,211,238,.12)" }
  }},
  plugins: []
} satisfies Config;
