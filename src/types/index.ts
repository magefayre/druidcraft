import type { Creature as Monster } from './5etools/bestiary'
import type {
  _SpeedMode,
  AbilityScoreAbbreviation as Ability,
  Alignment as _Alignment,
  CreatureType,
  DataCondition as Condition,
  DataDamageType as _Damage,
  EntrySpellcasting,
  Size,
  SkillNameLower as Skill
} from './5etools/util'

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

export type { Ability, Condition, CreatureType, Monster, Size, Skill }

export type Abilities = Partial<Record<Ability, number>>

export type Action = { name: string; entries: string[]; type?: ActionType }

export type ActionType = EntrySpellcasting['displayAs']

export type Alignment = _Alignment | 'T'

type CreatureBase = {
  cr?: number
  name: string
  source: Source
  speed?: Speeds
}

export type Creature = CreatureBase & {
  features?: Features
  rating?: Partial<Record<RatingType, number>>
  spell?: string
}

export type CreatureDetails = CreatureBase & {
  ability: Abilities
  ac?: Monster['ac']
  action?: Action[]
  alignment: Array<Alignment | string>
  bonus?: Action[]
  condition?: Condition[]
  hp?: Monster['hp']
  immune?: Array<Damage | DamageDetails>
  languages?: string[]
  legendary?: Action[]
  reaction?: Action[]
  resist?: Array<Damage | DamageDetails>
  save?: Partial<Record<Ability, number>>
  senses?: string[]
  size: Size
  skill?: Partial<Record<Skill, number>>
  trait?: Action[]
  type: CreatureType
  vulnerable?: Array<Damage | DamageDetails>
}

export type CreatureURL = Pick<Creature, 'source' | 'name'>

export type Damage = _Damage | string

export type DamageDetails = { [Key in DamageType]?: Damage[] } & {
  note: string
}

export type DamageType = 'immune' | 'resist' | 'vulnerable'

export type Feature = 'elementalForms'

export type Features = Partial<Record<Feature, boolean>>

export type Rating = 'red' | 'orange' | 'green' | 'blue'

export type RatingType = 'wildshape'

export type Ratings = Partial<Record<RatingType, Record<string, number>>>

export type Source = string

export type Speed = '' | _SpeedMode

export type Speeds = Partial<
  Record<Speed, number | { number: number; condition: string }>
>

export type Spell = {
  creatures?: Record<string, number>
  level: number
  limit?: boolean | number
  maxCR?: boolean | number
  spell?: boolean
  type: CreatureType
  upcast?: true | Record<number, number>
}
