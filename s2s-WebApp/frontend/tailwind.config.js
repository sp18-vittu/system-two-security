module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'error-500': '#F04438',
        'base-white': '#ffffff',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Add Inter as a font-family option
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'inter-semibold': ['Inter-SemiBold', 'sans-serif'],
      },
      keyframes: {
        widthExpand: {
          '0%': { width: '0%', height: '0%', opacity: 0 },
          '100%': { width: '70%', height: '80%', opacity: 1 },
        },
        widthCollapse: {
          '0%': { width: '70%', height: '80%', opacity: 1 },
          '100%': { width: '0%', height: '0%', opacity: 0 },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        lightningBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        colorChange: {
          '0%, 100%': { stroke: '#FF0000' }, // Red
          '33%': { stroke: '#00FF00' }, // Green
          '66%': { stroke: '#0000FF' }, // Blue
        },
        combinedSpinBlinkColor: {
          '0%, 100%': {
            transform: 'rotate(0deg)',
            opacity: '1',
            stroke: '#FF0000', // Red
          },
          '33%': {
            transform: 'rotate(120deg)',
            opacity: '0.5',
            stroke: '#00FF00', // Green
          },
          '66%': {
            transform: 'rotate(240deg)',
            opacity: '0.8',
            stroke: '#0000FF', // Blue
          },
        },
      },
      animation: {
        widthExpand: 'widthExpand 0.5s ease-in-out forwards',
        widthCollapse: 'widthCollapse 0.5s ease-in-out forwards',
        'spin-slow': 'spinSlow 3s linear infinite',
        'lightning-blink': 'lightningBlink 1s infinite',
        'color-blink': 'colorChange 3s infinite',
        'combined-spin-blink-color': 'combinedSpinBlinkColor 3s linear infinite',
      },
    },
  },
  screens: {
    // Min-width + Max-width breakpoints (for targeting specific ranges)
    sm: { min: '640px', max: '767px' }, // For screens between 640px and 767px
    md: { min: '768px', max: '1023px' }, // For screens between 768px and 1023px
    lg: { min: '1024px', max: '1279px' }, // For screens between 1024px and 1279px
    xl: { min: '1280px', max: '1535px' }, // For screens between 1280px and 1535px
    '2xl': { min: '1536px' }, // For screens larger than 1536px

    // Max-width breakpoints (for targeting smaller screens only)
    'max-sm': { max: '639px' }, // For screens smaller than 640px
    'max-md': { max: '767px' }, // For screens smaller than 768px
    'max-lg': { max: '1023px' }, // For screens smaller than 1024px
    'max-xl': { max: '1279px' }, // For screens smaller than 1280px
    'max-2xl': { max: '1535px' }, // For screens smaller than 1536px
  },
  plugins: [],
}
