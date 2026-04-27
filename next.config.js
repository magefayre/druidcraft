const withPlugins = require('next-compose-plugins')
const withSvgr = require('@newhighsco/next-plugin-svgr')
const withVideos = require('next-videos')

const BASE = new URL(
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-2014-img/main/'
)

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [new URL('**', BASE)]
  },
  i18n: { locales: ['en'], defaultLocale: 'en' },
  poweredByHeader: false,
  rewrites: () => [
    {
      source: '/tokens/:source/:name',
      destination: new URL('bestiary/tokens/:source/:name.webp', BASE).href
    }
  ],
  transpilePackages: ['@newhighsco/chipset', '@newhighsco/press-start'],
  webpack: config => {
    config.module.rules.push({
      test: /\.(txt|xml|woff(2)?)$/,
      use: 'file-loader'
    })

    return config
  }
}

module.exports = withPlugins(
  [[withSvgr, { inlineImageLimit: -1 }], [withVideos]],
  nextConfig
)
