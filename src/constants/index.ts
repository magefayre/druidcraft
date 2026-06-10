import type { Speed } from '~types'

export const CR = { walk: 0.25, swim: 0.5, fly: 1 }

export const CR_LABELS = {
  0.125: '1/8',
  [CR.walk]: '1/4',
  [CR.swim]: '1/2'
} as Readonly<Record<number, string>>

export const EMPTY = '-'

export const LEVELS = { min: 1, max: 20, walk: 2, swim: 4, fly: 8 } as Readonly<
  Record<'min' | 'max' | Speed, number>
>

export const LEVEL_SUFFIXES = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th'
} as Readonly<Record<Intl.LDMLPluralRule, string>>

export const PLURALS = new Intl.PluralRules('en', { type: 'ordinal' })

export const SPEEDS = {
  walk: { singular: 'Walks', continuous: 'walking' },
  burrow: { singular: 'Burrows', continuous: 'burrowing' },
  climb: { singular: 'Climbs', continuous: 'climbing' },
  swim: { icon: 'mdi:fish', singular: 'Swims', continuous: 'swimming' },
  fly: { icon: 'mdi:bird', singular: 'Flies', continuous: 'flying' }
} as Readonly<
  Record<Speed, { icon?: string; singular: string; continuous: string }>
>
