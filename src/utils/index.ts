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

export const formatCR = (cr: number) => CR_LABELS[cr] ?? cr ?? EMPTY

export const formatLevel = (level: number) =>
  `${level}${LEVEL_SUFFIXES[PLURALS.select(level)]}`

export const formatSpeedLimits = (level: number, locale?: string) => {
  if (level === LEVELS.min) return EMPTY

  const limits = Object.entries(SPEEDS).reduce<string[]>(
    (limits, [key, { continuous }]) =>
      level < LEVELS[key] ? [continuous, ...limits] : limits,
    []
  )

  if (!limits.length) return EMPTY

  const formatter = new Intl.ListFormat(locale, {
    style: 'short',
    type: 'disjunction'
  })

  return `No ${formatter.format(limits)} speed`
}

export const getCircleFormsCR = (level: number) =>
  Math.max(LEVELS.min, Math.floor(level / 3))

export const getMaxCR = ({ level, circleForms = false }) => {
  if (circleForms && level > LEVELS.min) return getCircleFormsCR(level)
  if (level >= LEVELS.fly) return CR.fly
  if (level >= LEVELS.swim) return CR.swim
  if (level > LEVELS.min) return CR.walk

  return null
}

export const getSpeedLimit = (
  level: number,
  speed: Beast['speed'],
  type: Speed
) => level < LEVELS[type] && !!speed[type]
