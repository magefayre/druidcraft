import slugify from '@sindresorhus/slugify'
import urlJoin from 'url-join'

import type { CreatureURL } from '~types'

export const tokenURL = ({ source, name }: CreatureURL) =>
  urlJoin('/tokens', `${source}-${name}.webp`)

export const url = ({ source, name }: CreatureURL, parse: boolean = true) =>
  urlJoin(
    '/creature',
    parse ? slugify(source, { separator: '' }) : source,
    parse
      ? slugify(name, { customReplacements: [['-', '']], decamelize: false })
      : name
  )
