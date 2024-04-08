/** @type {import('tailwindcss').Config} */
import theme from 'daisyui/src/theming/themes'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require("daisyui"),
  ],
  daisyui: {
    themes: [{
      corporate: {
        ...theme['corporate'],
        fontFamily: '"Lexend Deca", sans-serif',
        fontWeight: 400,
      },
    }],
  },
}