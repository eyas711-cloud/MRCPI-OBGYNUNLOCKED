import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "var(--navy)",
        teal: "var(--teal)",
        "teal-bright": "var(--teal-bright)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        gold: "var(--gold)",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Lora", "Georgia", "serif"],
        sans: ["'Public Sans'", "Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      fontSize: {
        "2xs": "0.75rem",
        xs: "0.875rem",
        sm: "1rem",
        base: "1.125rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
    },
  },
  plugins: [],
};
export default config;
