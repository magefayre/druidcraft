import {
  CR,
  CR_LABELS,
  EMPTY,
  LEVEL_SUFFIXES,
  LEVELS,
  PLURALS,
  SPEEDS
} from '~constants'
import type { Beast, Speed } from '~types'

const { fly, swim } = SPEEDS

export const formatCR = (cr: number) => CR_LABELS[cr] ?? cr ?? EMPTY

export const formatLevel = (level: number) =>
  `${level}${LEVEL_SUFFIXES[PLURALS.select(level)]}`

export const formatSpeedLimits = (level: number) => {
  if (level < LEVELS.walk) return EMPTY
  if (level < LEVELS.swim) return `No ${fly.verb} or ${swim.verb} speed`
  if (level < LEVELS.fly) return `No ${fly.verb} speed`

  return EMPTY
}

export const getCircleFormsCR = (level: number) =>
  Math.max(LEVELS.min, Math.floor(level / 3))

export const getMaxCR = ({ level, circleForms = false }) => {
  if (circleForms && level >= LEVELS.walk) return getCircleFormsCR(level)
  if (level >= LEVELS.fly) return CR.fly
  if (level >= LEVELS.swim) return CR.swim
  if (level >= LEVELS.walk) return CR.walk

  return null
}

export const getSpeedLimit = (
  level: number,
  speed: Beast['speed'],
  type: Speed
) => level < LEVELS[type] && !!speed[type]
