import slugify, { type Options } from '@sindresorhus/slugify'
import transliterate from '@sindresorhus/transliterate'

import type { Creature } from '~types'

type CreatureURL = Pick<Creature, 'source' | 'name'>

export const tokenURL = ({ source, name }: CreatureURL) =>
  `/tokens/${source}/${transliterate(name)}`

export const url = ({ source, name }: CreatureURL, options?: Options) =>
  `/creature/${slugify(source, { ...options, separator: '' })}/${slugify(name, options)}`
