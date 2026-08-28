module.exports = {
  content: ["./index.html", "./app.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', '-apple-system', 'BlinkMacSystemFont', '"PingFang TC"', '"Microsoft JhengHei"', 'sans-serif'],
        serif: ['"Noto Serif TC"', '"Songti TC"', '"STSong"', '"PMingLiU"', '"MingLiU"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(44, 36, 27, 0.08), 0 0 0 1px rgba(140, 90, 43, 0.05)',
        'glow': '0 0 25px rgba(140, 90, 43, 0.15)',
      }
    }
  },
  plugins: [],
}
