import { urlJoin } from '@newhighsco/chipset'
import slugify, { type Options } from '@sindresorhus/slugify'

import type { CreatureURL } from './types'

export const tokenURL = ({ source, name }: CreatureURL) =>
  urlJoin('/tokens', `${source}-${name}.webp`)

export const url = ({ source, name }: CreatureURL, options?: Options) =>
  urlJoin(
    '/creature',
    slugify(source, { ...options, separator: '' }),
    slugify(name, {
      ...options,
      customReplacements: [['-', '']],
      decamelize: false
    })
  )
