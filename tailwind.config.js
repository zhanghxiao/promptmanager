module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'ios-blue': '#007AFF',
          'ios-green': '#4CD964',
          'ios-red': '#FF3B30',
          'ios-orange': '#FF9500',
          'ios-yellow': '#FFCC00',
          'ios-purple': '#5856D6',
          'ios-pink': '#FF2D55',
          'ios-teal': '#5AC8FA',
          'ios-indigo': '#5E5CE6',
          'ios-gray': '#8E8E93',
          'ios-gray2': '#AEAEB2',
          'ios-gray3': '#C7C7CC',
          'ios-gray4': '#D1D1D6',
          'ios-gray5': '#E5E5EA',
          'ios-gray6': '#F2F2F7',
        },
        borderRadius: {
          'ios-sm': '6px',
          'ios-md': '10px',
          'ios-lg': '14px',
        },
        boxShadow: {
          'ios-sm': '0 2px 10px rgba(0, 0, 0, 0.05)',
          'ios-md': '0 5px 15px rgba(0, 0, 0, 0.1)',
        },
        fontFamily: {
          'ios': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }