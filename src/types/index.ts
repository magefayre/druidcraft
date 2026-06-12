export type Source = string
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'
export type MonsterType = 'beast' | 'dragon' | 'elemental' | 'fey' | 'plant'

export type Creature = {
  cr?: number
  name: string
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
