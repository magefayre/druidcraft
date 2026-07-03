import type { Creature } from '~types'

export type CreatureURL = Pick<Creature, 'source' | 'name'>

export type CreatureListProps = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  speedLimits?: boolean
}

export type CreatureCardProps = Creature & {
  disabled?: boolean
  limit?: number
  priority?: boolean
  speedLimits?: boolean
}
