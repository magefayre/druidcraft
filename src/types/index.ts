declare global {
  var Parser: {
    SOURCE_JSON_TO_FULL: Record<string, string>
    SOURCES_CORE_SUPPLEMENTS: Set<string>
    SOURCES_NON_STANDARD_WOTC: Set<string>
    SOURCES_VANILLA: Set<string>
    SRC_MCVX_PREFIX: string
    SRC_PS_PREFIX: string
  }
}

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'
export type Abilities = Partial<Record<Ability, number>>
export type Action = { name: string; entries: string[] }
export type Aligmnent = 'U' | 'N' | 'L' | 'C' | 'G' | 'E'
export type ArmorClass = number | { ac: number; from: string[] }
export type Condition =
  | 'blinded'
  | 'charmed'
  | 'deafened'
  | 'exhaustion'
  | 'frightened'
  | 'grappled'
  | 'incapacitated'
  | 'invisible'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrainedv'
  | 'stunned'
  | 'unconscious'
export type Damage =
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poision'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder'
export type Feature = 'elementalForms'
export type Features = Partial<Record<Feature, boolean>>
export type Health = { average: number; formula: string } | { special: number }
export type Size = 'T' | 'S' | 'M' | 'L' | 'H' | 'G'
export type Skill =
  | 'acrobatics'
  | 'animal handling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleight of hand'
  | 'stealth'
  | 'survival'
export type Skills = Partial<Record<Skill, number>>
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'
export type Speeds = Partial<Record<Speed, number>>

type CreatureBase = {
  cr?: number
  name: string
  source: string
  speed?: Speeds
}

export type Creature = CreatureBase & {
  features?: Features
  rating?: number
  spell?: string
}

export type CreatureDetails = CreatureBase &
  Pick<
    Monster,
    | 'ac'
    | 'action'
    | 'alignment'
    | 'bonus'
    | 'hp'
    | 'languages'
    | 'senses'
    | 'trait'
    | 'type'
  > & { ability: Abilities; size: Size; skill?: Skills }

export type CreatureURL = Pick<Creature, 'source' | 'name'>

export type Monster = {
  _copy: Partial<Creature>
  ac: ArmorClass[]
  action?: Action[]
  alignment: Aligmnent[]
  bonus?: Action[]
  cr: string
  hp: Health
  isNpc?: boolean
  languages?: string[]
  name: string
  reprintedAs?: string[]
  senses: string[]
  size: Size[]
  skill?: MonsterSkills
  source: string
  speed?: Speeds
  summonedBySpell?: string
  trait?: Action[]
  type: MonsterType
} & { [key in Ability]: number }

export type Monsters = { monster: Monster[] }
export type MonsterSkills = Partial<Record<Skill, string>>
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
