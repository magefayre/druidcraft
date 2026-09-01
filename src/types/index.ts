import type { Creature as Monster } from './5etools/bestiary'
import type { _SpeedMode, CreatureType } from './5etools/util'

declare global {
  var Parser: {
    SOURCE_JSON_TO_FULL: Record<Source, string>
    SOURCES_CORE_SUPPLEMENTS: Set<Source>
    SOURCES_NON_STANDARD_WOTC: Set<Source>
    SOURCES_VANILLA: Set<Source>
    SRC_MCVX_PREFIX: string
    SRC_PS_PREFIX: string
  }
}

export type { CreatureType, Monster }

export type Feature = 'elementalForms'
export type Features = Partial<Record<Feature, boolean>>
export type Source = string
export type Speed = '' | _SpeedMode
export type Speeds = Partial<
  Record<Speed, number | { number: number; condition: string }>
>
export type MonsterRating = 'red' | 'orange' | 'green' | 'blue'

export type Creature = {
  cr?: number
  features?: Features
  name: string
  rating?: number
  source: Source
  speed?: Speeds
  spell?: string
}

export type MonsterRatings = Record<string, number>

export type Spell = {
  creatures?: Record<string, number>
  level: number
  limit?: boolean | number
  maxCR?: boolean | number
  spell?: boolean
  type: CreatureType
  upcast?: true | Record<number, number>
}
