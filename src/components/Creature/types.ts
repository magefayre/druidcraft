import type { Creature, View } from '~types'

export type CreatureURL = Pick<Creature, 'source' | 'name'>

export type CreatureListProps = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  speedLimits?: boolean
  view?: View
}

export type CreatureCardProps = Creature & {
  disabled?: boolean
  limit?: number
  priority?: boolean
  speedLimits?: boolean
  view: View
}
