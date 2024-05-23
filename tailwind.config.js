/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
   theme: {
      extend: {
        fontFamily: {
          sans: ['Montserrat', 'sans-serif'],
        },
         colors: {
            primary: {
               50: "#f4f3ff",
               100: "#ebeafd",
               200: "#dbd7fd",
               300: "#bfb7fb",
               400: "#9f8ef7",
               500: "#8060f2",
               600: "#6e3fe8",
               700: "#5e2bd4",
               800: "#5025b2",
               900: "#432092",
               950: "#281263",
            },
         },
         transitionProperty: {
            height: "height",
            spacing: "margin, padding",
         },
         keyframes: {
            fadeIn: {
               "0%, 100%": { opacity: 0 },
               "100%": { opacity: 1 },
            },
            fadeOut: {
               "0%, 100%": { opacity: 1 },
               "100%": { opacity: 0 },
            },
         },
         animation: {
            fadeIn: "fadeIn 0.5s ease-in-out",
            fadeOut: "fadeOut 0.5s ease-in-out",
         },
      },
   },
   variants: {
      extend: {
         display: ["group-hover"],
      },
   },
   plugins: [],
};
