import slugify from '@sindresorhus/slugify'
import urlJoin from 'url-join'

import type { CreatureDetails, CreatureURL, Source } from '~types'
import {
  formatAligment,
  formatList,
  formatSize,
  formatType
} from '~utils/5etools'

export const slugifyName = (name: string) =>
  slugify(name, { customReplacements: [['-', '']], decamelize: false })

export const slugifySource = (source: Source) =>
  slugify(source, { separator: '' })

export const summary = ({ alignment, size, type }: Partial<CreatureDetails>) =>
  formatList([
    `${formatSize(size)} ${formatType(type)}`,
    formatAligment(alignment)
  ])

export const tokenURL = ({ source, name }: CreatureURL) =>
  urlJoin('/tokens', slugifySource(source), `${slugifyName(name)}.webp`)

export const url = ({ source, name }: CreatureURL, parse: boolean = true) =>
  urlJoin(
    '/creature',
    parse ? slugifySource(source) : source,
    parse ? slugifyName(name) : name
  )
