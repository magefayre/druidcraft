import slugify, { type Options } from '@sindresorhus/slugify'

import type { CreatureURL } from './types'

export const tokenURL = ({ source, name }: CreatureURL) =>
  `/tokens/${source}-${name}.webp`

export const url = ({ source, name }: CreatureURL, options?: Options) =>
  `/creature/${slugify(source, { ...options, separator: '' })}/${slugify(name, options)}`
