/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./Screens/**/*.{js,jsx,ts,tsx}",
    "./Components/**/*.{js,jsx,ts,tsx}",
    "./Navigations/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [" Inter_500Medium"],
        sans_light: ["Inter_300Light"],
        sans_regular: ["Inter_400Regular"],
        sans_semibold: [" Inter_600SemiBold"],
        sans_bold: ["Inter_700Bold"],
        sans_extrabold: [" Inter_800ExtraBold"],
      },
    },
  },
  plugins: [],
}

