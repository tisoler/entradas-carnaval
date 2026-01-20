import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carnival: {
          primary: '#DC2626', // Rojo
          secondary: '#2563EB', // Azul
          accent: '#1F2937', // Negro/gris oscuro
          purple: '#1E40AF', // Azul oscuro
          pink: '#991B1B', // Rojo oscuro
        },
      },
    },
  },
  plugins: [],
};
export default config;
