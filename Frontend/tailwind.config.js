const flowbite = require("flowbite-react/tailwind");
const tailwind_scrollbar = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],

  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin(), tailwind_scrollbar],
};
