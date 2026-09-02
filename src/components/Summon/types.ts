import type { Creature, CreatureType } from '~types'

export type SummonFormData = { sort: string; spell: string; upcast: number }

export type SummonProps = { creatures: Record<CreatureType, Creature[]> }
