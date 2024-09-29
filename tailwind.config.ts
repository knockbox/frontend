import type {Config} from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
  safelist: [
    // Contains all styles that will be compiled regardless
    // Fixes issues where conditional styles are removed.
  ]
} satisfies Config

