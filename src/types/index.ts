export type MonsterType = 'beast' | 'dragon' | 'elemental' | 'fey' | 'plant'
export type Rating = 'red' | 'orange' | 'green' | 'blue'
export type Source = string
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'

export type Creature = {
  cr?: number
  name: string
  rating?: Rating
  source: Source
  speed: Record<Speed, number>
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
export type MonsterRatings = Record<string, Rating>

export type Spell = {
  creatures?: Record<string, number>
  level: number
  limit?: boolean | number
  maxCR?: boolean | number
  spell?: boolean
  type: MonsterType
  upcast?: true | Record<number, number>
}
