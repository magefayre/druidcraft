import slugify from '@sindresorhus/slugify'
import transliterate from '@sindresorhus/transliterate'

import type { Beast } from '~types'

type BasicBeast = Pick<Beast, 'source' | 'name'>

export const tokenURL = ({ source, name }: BasicBeast) =>
  `/tokens/${source}/${transliterate(name)}`

export const url = ({ source, name }: BasicBeast) =>
  `/beast/${slugify(source, { separator: '' })}/${slugify(name)}`
