import type { Creature, CreatureDetails, RatingType } from '~types'

export type CreatureCardProps = Omit<Creature, 'rating'> & {
  disabled?: boolean
  limit?: number
  priority?: boolean
  speedLimits?: boolean
  rating?: number
}

export type CreatureDetailsProps = CreatureDetails

export type CreatureListProps = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  ratings?: RatingType
  speedLimits?: boolean
}
