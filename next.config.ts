import withSvgr from '@newhighsco/next-plugin-svgr'
import type { NextConfig } from 'next'
import withPlugins from 'next-compose-plugins'

import { tokenURL } from '~components/Beast/utils'

const BASE = new URL(
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-2014-img/main/'
)

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [new URL('**', BASE)]
  },
  i18n: { locales: ['en'], defaultLocale: 'en' },
  poweredByHeader: false,
  redirects: () => [
    {
      source: '/beast/:source/:name',
      destination: 'https://2014.5e.tools/bestiary/:name-:source.html',
      permanent: true
    }
  ],
  rewrites: () => [
    {
      source: tokenURL({ source: ':source', name: ':name' }),
      destination: new URL('bestiary/tokens/:source/:name.webp', BASE).href
    }
  ],
  transpilePackages: ['@newhighsco/chipset', '@newhighsco/press-start'],
  typedRoutes: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.(txt|xml|woff(2)?)$/,
      use: 'file-loader'
    })

    return config
  }
}

export default withPlugins([[withSvgr, { inlineImageLimit: -1 }]], nextConfig)
