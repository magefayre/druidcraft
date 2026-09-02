import type { Creature, CreatureDetails } from '~types'

export type CreatureCardProps = Creature & {
  disabled?: boolean
  limit?: number
  priority?: boolean
  speedLimits?: boolean
}

export type CreatureDetailsProps = CreatureDetails

export type CreatureListProps = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  ratings?: boolean
  speedLimits?: boolean
}
