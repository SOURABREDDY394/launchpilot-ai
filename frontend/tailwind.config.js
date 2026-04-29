/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "launchpilot-grid":
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(135deg, rgba(15, 23, 42, 0.04) 25%, transparent 25%)",
      },
    },
  },
  plugins: [],
};

