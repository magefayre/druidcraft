import slugify from '@sindresorhus/slugify'
import urlJoin from 'url-join'

import type { CreatureURL } from '~types'

export const slugifyName = (name: string) =>
  slugify(name, { customReplacements: [['-', '']], decamelize: false })

export const slugifySource = (source: string) =>
  slugify(source, { separator: '' })

export const tokenURL = ({ source, name }: CreatureURL) =>
  urlJoin('/tokens', `${source}-${name}.webp`)

export const url = ({ source, name }: CreatureURL, parse: boolean = true) =>
  urlJoin(
    '/creature',
    parse ? slugifySource(source) : source,
    parse ? slugifyName(name) : name
  )
