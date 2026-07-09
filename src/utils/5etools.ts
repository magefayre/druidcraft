import {
  CR,
  CR_LABELS,
  CR_LIMITS,
  EMPTY,
  LEVEL_SUFFIXES,
  LEVELS,
  PLURALS,
  SPEEDS,
  SPELL_LEVELS,
  SPELLS
} from '~constants'
import { VERSION } from '~scripts/constants'
import type { Creature, MonsterType, Source, Speed, Spell } from '~types'

export const formatCR = (cr: number) => CR_LABELS[cr] ?? cr ?? EMPTY

export const formatCRLimit = (cr: number) => {
  const min = Math.min(...(Object.keys(CR_LIMITS) as unknown as number[]))

  if (cr < min) cr = min

  return CR_LIMITS[cr]
}

export const formatLevel = (level: number) =>
  `${level}${LEVEL_SUFFIXES[PLURALS.select(level)]}`

export const formatSpeedLimits = (level: number, locale?: string) => {
  if (level < LEVELS.walk) return EMPTY

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

export const getMaxCR = ({
  level,
  circleForms = false
}: {
  level: number
  circleForms?: boolean
}) => {
  if (circleForms && level >= LEVELS.walk) return getCircleFormsCR(level)
  if (level >= LEVELS.fly) return CR.fly
  if (level >= LEVELS.swim) return CR.swim
  if (level >= LEVELS.walk) return CR.walk

  return null
}

export const getSpellCR = (spell?: Spell, level?: number) => {
  if (typeof spell?.upcast === 'boolean' && level) return level
  if (typeof spell?.maxCR === 'boolean') return spell?.level

  return spell?.maxCR
}

export const getSpeedLimit = (
  level: number,
  speed: Creature['speed'],
  type: Speed
) => level < LEVELS[type] && !!speed[type]

export const getTypeCR = (type: MonsterType) =>
  Object.values(SPELLS).reduce<number | undefined>((cr, spell) => {
    const maxCR = getSpellCR(spell, SPELL_LEVELS.max)

    return spell.type === type && (cr === undefined || maxCR > cr) ? maxCR : cr
  }, undefined)

export const getVersion = () => VERSION

export const isCoreSource = (source: Source) =>
  Parser.SOURCES_CORE_SUPPLEMENTS.has(source) &&
  !source.startsWith(Parser.SRC_MCVX_PREFIX) &&
  !source.startsWith(Parser.SRC_PS_PREFIX) &&
  !Parser.SOURCES_NON_STANDARD_WOTC.has(source)

export const sortAlphabetically = <T extends string>(a: T, b: T) =>
  a.localeCompare(b)

export const sortCreatures =
  <T extends Creature>(sortBy: keyof T = 'cr') =>
  (a: T, b: T) => {
    if (sortBy === 'cr') {
      if (a.cr !== b.cr) {
        const fallback = Number.MIN_SAFE_INTEGER

        return (a.cr ?? fallback) - (b.cr ?? fallback)
      }
    }

    if (a.name !== b.name) return sortAlphabetically(a.name, b.name)

    return sortAlphabetically(a.source, b.source)
  }

export const sortSources = <T extends [Source, string]>([, a]: T, [, b]: T) =>
  sortAlphabetically(a, b)
