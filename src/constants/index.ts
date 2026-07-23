import type { MonsterRating, Speed, Spell } from '~types'

export const CR = { walk: 0.25, swim: 0.5, fly: 1 }

export const CR_LABELS = {
  0.125: '1/8',
  [CR.walk]: '1/4',
  [CR.swim]: '1/2'
} as Readonly<Record<number, string>>

export const CR_LIMITS = {
  [CR.walk]: 8,
  [CR.swim]: 4,
  [CR.fly]: 2,
  2: 1
} as Readonly<Record<number, number>>

export const DESCENDING = 'des'

export const ELEMENTAL_FORMS = /^(Air|Earth|Fire|Water)\sElemental$/

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

export const RATINGS = { red: 1, orange: 2, green: 3, blue: 4 } as Readonly<
  Record<MonsterRating, number>
>

export const SEPARATOR = ':'

export const SORTING = {
  CR: { min: 'Low', max: 'High' },
  Name: { min: 'A', max: 'Z' },
  Rating: { min: 'Low', max: 'High' }
} as Readonly<Record<string, { min: string; max: string }>>

export const SPEEDS = {
  walk: { singular: 'Walks', continuous: 'walking' },
  burrow: { singular: 'Burrows', continuous: 'burrowing' },
  climb: { singular: 'Climbs', continuous: 'climbing' },
  swim: { icon: true, singular: 'Swims', continuous: 'swimming' },
  fly: { icon: true, singular: 'Flies', continuous: 'flying' }
} as Readonly<
  Record<Speed, { icon?: boolean; singular: string; continuous: string }>
>

export const SPELL_LEVELS = { max: 9 } as Readonly<Record<'max', number>>

export const SPELLS = {
  'Summon Beast': { level: 2, spell: true, type: 'beast' },
  'Conjure Animal': {
    level: 3,
    limit: true,
    maxCR: 2,
    type: 'beast',
    upcast: { 5: 2, 7: 3, [SPELL_LEVELS.max]: 4 }
  },
  'Summon Fey': { level: 3, spell: true, type: 'fey' },
  'Conjure Minor Elementals': {
    level: 4,
    limit: true,
    maxCR: 2,
    type: 'elemental',
    upcast: { 6: 2, 8: 3 }
  },
  'Conjure Woodland Being': {
    level: 4,
    limit: true,
    maxCR: 2,
    type: 'fey',
    upcast: { 6: 2, 8: 3 }
  },
  'Giant Insect': {
    creatures: {
      'Giant Centipede': 10,
      'Giant Spider': 3,
      'Giant Wasp': 5,
      'Giant Scorpion': 1
    },
    level: 4,
    type: 'beast'
  },
  'Summon Elemental': { level: 4, spell: true, type: 'elemental' },
  Awaken: {
    creatures: { 'Awakened Shrub': 1, 'Awakened Tree': 1 },
    level: 4,
    type: 'plant'
  },
  'Conjure Elemental': {
    level: 5,
    limit: 1,
    maxCR: true,
    type: 'elemental',
    upcast: true
  },
  'Summon Draconic Spirit': { level: 5, spell: true, type: 'dragon' },
  'Conjure Fey': { level: 6, limit: 1, maxCR: true, type: 'fey', upcast: true },
  'Druid Grove': { creatures: { 'Awakened Tree': 4 }, level: 6, type: 'plant' }
} as Readonly<Record<string, Spell>>
