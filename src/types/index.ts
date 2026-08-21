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

export type Action = { name: string; entries: string[] }
export type Aligmnent = 'U' | 'N' | 'L' | 'C' | 'G' | 'E'
export type Feature = 'elementalForms'
export type Features = Partial<Record<Feature, boolean>>
export type Modifier = `+${number}`
export type Size = 'T' | 'S' | 'M' | 'H' | 'G'
export type Skill = 'perception' | 'stealth'
export type Skills = Partial<Record<Skill, Modifier>>
export type Source = string
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'
export type Speeds = Partial<Record<Speed, number>>

export type Creature = {
  cr?: number
  details?: Partial<Monster>
  features?: Features
  name: string
  rating?: number
  source: Source
  speed?: Speeds
  spell?: string
}

export type Monster = {
  _copy: Partial<Creature>
  ac: number[]
  action: Action[]
  alignment: Aligmnent[]
  cha: number
  con: number
  cr: string
  dex: number
  hp: { average: number; formula: string }
  int: number
  isNpc?: boolean
  name: string
  reprintedAs?: string[]
  senses: string[]
  size: Size[]
  skill: Skills
  source: Source
  speed?: Speeds
  str: number
  summonedBySpell?: string
  trait: Action[]
  type: MonsterType
  wis: number
}

export type Monsters = { monster: Monster[] }
export type MonsterRating = 'red' | 'orange' | 'green' | 'blue'
export type MonsterRatings = Record<string, number>
export type MonsterType = 'beast' | 'dragon' | 'elemental' | 'fey' | 'plant'

export type Spell = {
  creatures?: Record<string, number>
  level: number
  limit?: boolean | number
  maxCR?: boolean | number
  spell?: boolean
  type: MonsterType
  upcast?: true | Record<number, number>
}
