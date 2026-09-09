import type { Card } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'

import type { Creature, CreatureDetails, RatingType } from '~types'

export type CreatureCardProps = PropTypes.InferProps<Card.propTypes> &
  Omit<Creature, 'rating'> & {
    disabled?: boolean
    limit?: number
    priority?: boolean
    speedLimits?: boolean
    rating?: number
  }

export type CreatureDetailsProps = CreatureDetails & { dialog?: boolean }

export type CreatureListProps = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  ratings?: RatingType
  speedLimits?: boolean
}
