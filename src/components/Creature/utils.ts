import slugify from '@sindresorhus/slugify'
import urlJoin from 'url-join'

import type { CreatureURL } from '~types'

export const formatSlug = (name: string) =>
  slugify(name, { customReplacements: [['-', '']], decamelize: false })

export const formatSource = (source: string) =>
  slugify(source, { separator: '' })

export const tokenURL = ({ source, name }: CreatureURL) =>
  urlJoin('/tokens', `${source}-${name}.webp`)

export const url = ({ source, name }: CreatureURL, parse: boolean = true) =>
  urlJoin(
    '/creature',
    parse ? formatSource(source) : source,
    parse ? formatSlug(name) : name
  )
