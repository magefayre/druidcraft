import slugify, { type Options } from '@sindresorhus/slugify'
import transliterate from '@sindresorhus/transliterate'

import type { Beast } from '~types'

type BeastURL = Pick<Beast, 'source' | 'name'>

export const tokenURL = ({ source, name }: BeastURL) =>
  `/tokens/${source}/${transliterate(name)}`

export const url = ({ source, name }: BeastURL, options?: Options) =>
  `/beast/${slugify(source, { ...options, separator: '' })}/${slugify(name, options)}`
