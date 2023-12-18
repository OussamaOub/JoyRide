/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
  plugins: [require('@tailwindcss/forms')],
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  theme: {
    extend: {
      fontFamily: {
        nasalization: 'nasalization'
      }
    },
    screens: {
      mobile: { max: '767px' },
      // => @media (max-width: 767px) { ... }
      lg: { min: '768px' }
    }
  }
}
