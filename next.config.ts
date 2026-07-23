import withSvgr from '@newhighsco/next-plugin-svgr'
import type { NextConfig } from 'next'
import withPlugins from 'next-compose-plugins'

import { url } from '~components/Creature/utils'

const preserveCharacters = [':', '*']

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  i18n: { locales: ['en'], defaultLocale: 'en' },
  poweredByHeader: false,
  redirects: () => [
    {
      source: '/beast/:slug*',
      destination: url({ source: ':slug*', name: '' }, { preserveCharacters }),
      permanent: true
    },
    {
      source: url({ source: ':source', name: ':name' }, { preserveCharacters }),
      destination: 'https://2014.5e.tools/bestiary/:name-:source.html',
      permanent: true
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
