module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      "outer-space": "#2B3131",
      "spring-wood": "#F5F3ED",
      "cinna-bar": "#E1444B",
      "old-gold": "#D5AB4F",
    },
    extend: {
      spacing: {
        72: "18rem",
        96: "24rem",
        128: "32rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
