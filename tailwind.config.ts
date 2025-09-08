import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // FuSteps Custom Colors
        ink: {
          900: "var(--ink-900)",
          700: "var(--ink-700)",
          500: "var(--ink-500)",
          300: "var(--ink-300)",
        },
        sky: {
          100: "var(--sky-100)",
          300: "var(--sky-300)",
          500: "var(--sky-500)",
          700: "var(--sky-700)",
        },
        leaf: {
          100: "var(--leaf-100)",
          300: "var(--leaf-300)",
          500: "var(--leaf-500)",
          700: "var(--leaf-700)",
        },
        slate: {
          100: "var(--slate-100)",
          300: "var(--slate-300)",
          500: "var(--slate-500)",
          700: "var(--slate-700)",
        },
        ember: {
          100: "var(--ember-100)",
          300: "var(--ember-300)",
          500: "var(--ember-500)",
          700: "var(--ember-700)",
        },
        neutral: {
          25: "var(--neutral-25)",
          100: "var(--neutral-100)",
          900: "var(--neutral-900)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ['Poppins', 'Inter', 'ui-sans-serif'],
        body: ['Inter', 'system-ui']
      },
      boxShadow: {
        card: '0 6px 24px rgba(0,0,0,.06)',
        modal: '0 12px 40px rgba(0,0,0,.16)'
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
