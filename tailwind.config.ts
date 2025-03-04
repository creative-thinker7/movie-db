import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      montserrat: ["var(--font-montserrat)"],
    },
    extend: {
      colors: {
        prospectory: {
          primary: "#2BD17E",
          error: "#EB5757",
          background: "#093545",
          input: "#224957",
          card: "#092C39",
        },
      },
      fontSize: {
        "heading-one": [
          "64px",
          {
            lineHeight: "80px",
            letterSpacing: "0",
            fontWeight: "600",
          },
        ],
        "heading-two": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "0",
            fontWeight: "600",
          },
        ],
        "heading-three": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "0",
            fontWeight: "600",
          },
        ],
        "heading-four": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "0",
            fontWeight: "700",
          },
        ],
        "heading-five": [
          "20px",
          {
            lineHeight: "24px",
            letterSpacing: "0",
            fontWeight: "700",
          },
        ],
        "heading-six": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "0",
            fontWeight: "700",
          },
        ],
        "body-large": [
          "20px",
          {
            lineHeight: "32px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        "body-regular": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        "body-small": [
          "14px",
          {
            lineHeight: "24px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        "body-extrasmall": [
          "12px",
          {
            lineHeight: "24px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        caption: [
          "14px",
          {
            lineHeight: "16px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
      },
      fontWeight: {
        bold: "700",
        semibold: "600",
        normal: "400",
      },
      borderRadius: {
        md: "5px",
        xl: "10px",
      },
      maxWidth: {
        "grid-max": "1440px",
      },
      height: {
        "card-image": "400px",
        "card-image-sm": "246px",
      },
      margin: {
        default: "120px",
        "default-sm": "80px",
      },
      padding: {
        default: "120px",
        "default-sm": "80px",
      },
      inset: {
        default: "120px",
        "default-sm": "80px",
      },
    },
  },
  plugins: [],
} satisfies Config;
