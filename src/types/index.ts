export type Source = string
export type Speed = 'walk' | 'burrow' | 'climb' | 'swim' | 'fly'

export type Beast = {
  cr: number
  name: string
  source: Source
  speed: Record<Speed, number>
}

export type Monster = Beast & {
  _copy: Partial<Beast>
  cr: string
  type: string
}

export type Monsters = { monster: Monster[] }
