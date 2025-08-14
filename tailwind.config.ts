import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        plSky: "#111010",
        plSkyLight: "#00bc7d",
        plPurple: "#6b5ce6",
        plPurpleLight: "",
        plYellow: "#E79959",
        plYellowLight: "#CDFFE9",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        passionate: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

// hooks/useLocalFonts.ts
import { useEffect, useState } from 'react'
import { url } from "node:inspector/promises";

export const useLocalFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Load Feeling Passionate font
        const feelingPassionateFont = new FontFace(
          'Feeling Passionate',
          'url(/fonts/FeelingPassionate/FeelingPassionate-Regular.woff2) format("woff2"), url(/fonts/FeelingPassionate/FeelingPassionate-Bold.woff2) format("woff2")'
        )

        // Load Custom Sans font
        const customSansFont = new FontFace(
          'Custom Sans',
          'url(/fonts/CustomSans-Regular.woff2) format("woff2")'
        )

        // Wait for all fonts to load
        await Promise.all([
          feelingPassionateFont.load(),
          customSansFont.load()
        ])

        // Add fonts to document
        document.fonts.add(feelingPassionateFont)
        document.fonts.add(customSansFont)

        setFontsLoaded(true)
      } catch (error) {
        console.error('Font loading failed:', error)
        setFontsLoaded(false)
      }
    }

    // Check if fonts are already loaded
    if (document.fonts.check('16px "Feeling Passionate"')) {
      setFontsLoaded(true)
    } else {
      loadFonts()
    }
  }, [])

  return fontsLoaded
}

// Usage in component
// Move the following code to a separate file like MyComponent.tsx if you want to use it in a React component:

// import { useLocalFonts } from './hooks/useLocalFonts'

// const MyComponent = () => {
//   const fontsLoaded = useLocalFonts()

//   return (
//     <h1 className={`text-4xl transition-opacity duration-300 ${
//       fontsLoaded 
//         ? 'font-feeling-passionate opacity-100' 
//         : 'font-serif opacity-75'
//     }`}>
//       {fontsLoaded ? 'Passionate Title' : 'Loading...'}
//     </h1>
//   )
// }
