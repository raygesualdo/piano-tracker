const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')

const PROD = process.env.NODE_ENV === 'production'

module.exports = () => ({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    PROD &&
      purgecss({
        content: ['src/*.pug', 'src/*.js'],
        defaultExtractor: (content) => {
          // Capture as liberally as possible, including things like `h-(screen-1.5)`
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
          // Capture classes within other delimiters like .block(class="w-1/2") in Pug
          const innerMatches =
            content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
          return broadMatches.concat(innerMatches)
        },
      }),
    PROD &&
      cssnano({
        preset: 'default',
      }),
  ].filter(Boolean),
})
