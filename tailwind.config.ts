import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { base: "#0d0d0d", surface: "#1c1c1e", accent: "#fa2d48" },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', '"SF Pro Text"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) =>
      addUtilities({
        ".glass": {
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        },
        ".glass-strong": {
          background: "rgba(28,28,30,0.72)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        },
      })
    ),
  ],
};
export default config;
