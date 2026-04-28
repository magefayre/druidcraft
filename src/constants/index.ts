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

export const SPEED_VERBS = { swim: 'Swims', fly: 'Flies' } as Readonly<
  Record<Speed, string>
>
