export type Source = string

export type Beast = {
  cr: number
  name: string
  source: Source
  speed: Record<string, unknown>
}

export type Monster = Beast & {
  _copy: Partial<Beast>
  cr: string
  type: string
}

export type Monsters = { monster: Monster[] }
