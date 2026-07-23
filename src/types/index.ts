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

export type Feature = 'elementalForms'
export type Features = Partial<Record<Feature, boolean>>
export type Source = string
export type Speed = '' | 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'
export type Speeds = Partial<Record<Speed, number>>
export type MonsterRating = 'red' | 'orange' | 'green' | 'blue'
export type MonsterType = 'beast' | 'dragon' | 'elemental' | 'fey' | 'plant'

export type Creature = {
  cr?: number
  features?: Features
  name: string
  rating?: number
  source: Source
  speed: Speeds
  spell?: string
}

export type Monster = Creature & {
  _copy: Partial<Creature>
  cr: string
  isNpc?: boolean
  reprintedAs?: string[]
  summonedBySpell?: string
  type: MonsterType
}

export type Monsters = { monster: Monster[] }
export type MonsterRatings = Record<string, number>

export type Spell = {
  creatures?: Record<string, number>
  level: number
  limit?: boolean | number
  maxCR?: boolean | number
  spell?: boolean
  type: MonsterType
  upcast?: true | Record<number, number>
}
