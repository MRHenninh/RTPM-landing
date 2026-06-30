import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // RTPM brand indigo ramp
        indigo: {
          DEFAULT: "#0d08d2",
          900: "#070474",
          800: "#090693",
          700: "#0d08d2",
          600: "#0b07b9",
          500: "#312dd9",
          400: "#5652e0",
          "050": "#e7e6fa",
        },
        // Accent + semantic/status colors (fixed meaning per brand guide)
        accent: "#ffcc00",
        success: "#28a745",
        critical: "#e63946",
        warning: "#ff8b00",
        info: "#00acff",
        // Neutrals
        ink: "#111827",
        graytext: "#6b7280",
        fog: "#F3F4F6",
        bordergray: "#E5E7EB",
        // Legacy tokens retained so existing risk board / detail keep rendering
        emerald: { DEFAULT: "#10B981" },
        amber: { DEFAULT: "#F59E0B" },
      },
      fontFamily: {
        head: ['"Barlow Condensed"', "system-ui", "sans-serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        panel: "0 2px 8px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
        input: "4px",
      },
      transitionTimingFunction: {
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [typography],
};
