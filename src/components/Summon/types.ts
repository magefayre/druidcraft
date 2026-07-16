import type { Creature, MonsterType } from '~types'

export type SummonFormData = { sort: string; spell: string; upcast: number }

export type SummonProps = { creatures: Record<MonsterType, Creature[]> }
