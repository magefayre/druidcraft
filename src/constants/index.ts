import type { MonsterType, Speed } from '~types'

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

export const SPELLS = {
  'Summon Beast': { spell: true, type: 'beast' },
  'Conjure Animal': { limit: true, maxCR: 2, type: 'beast' },
  'Summon Fey': { spell: true, type: 'fey' },
  'Conjure Minor Elementals': { limit: true, maxCR: 2, type: 'elemental' },
  'Conjure Woodland Being': { limit: true, maxCR: 2, type: 'fey' },
  'Giant Insect': {
    creatures: {
      'Giant Centipede': 10,
      'Giant Spider': 3,
      'Giant Wasp': 5,
      'Giant Scorpion': 1
    },
    type: 'beast'
  },
  'Summon Elemental': { spell: true, type: 'elemental' },
  Awaken: {
    creatures: { 'Awakened Shrub': 1, 'Awakened Tree': 1 },
    type: 'plant'
  },
  'Conjure Elemental': { limit: 1, maxCR: 5, type: 'elemental' },
  'Summon Draconic Spirit': { spell: true, type: 'dragon' },
  'Conjure Fey': { limit: 1, maxCR: 6, type: 'fey' },
  'Druid Grove': { creatures: { 'Awakened Tree': 4 }, type: 'plant' }
} as Readonly<
  Record<
    string,
    {
      creatures?: Record<string, number>
      limit?: boolean | number
      maxCR?: number
      spell?: boolean
      type: MonsterType
    }
  >
>
