export type Source = string
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'

export type Creature = {
  cr: number
  name: string
  source: Source
  speed: Record<Speed, number>
}

export type Monster = Creature & {
  _copy: Partial<Creature>
  cr: string
  type: string
  summonedBySpell?: string
}

export type Monsters = { monster: Monster[] }
