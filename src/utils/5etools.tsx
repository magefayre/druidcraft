import { titleCase } from 'title-case'

import DiceRoller from '~components/DiceRoller'
import {
  ABILITY_BASE,
  ALIGNMENTS,
  CR,
  CR_LABELS,
  CR_LIMITS,
  EMPTY,
  LEVEL_SUFFIXES,
  LEVELS,
  PLURALS,
  SIZES,
  SPEEDS,
  SPELL_LEVELS,
  SPELLS
} from '~constants'
import SOURCES from '~data/sources.json' with { type: 'json' }
import type {
  Condition,
  Creature,
  CreatureDetails,
  CreatureType,
  Damage,
  DamageDetails,
  DamageType,
  Monster,
  Size,
  Speed,
  Speeds,
  Spell
} from '~types'

export const formatAC = (ac: Monster['ac']) => {
  const { base, detailed } = ac.reduce(
    (parsed, value) => {
      const setBase = (value: string | number, details?: string[]) => {
        if (parsed.base === undefined) {
          parsed.base = value
        } else {
          details.unshift(`${value}`)
        }

        if (details?.length) {
          parsed.detailed.push(details.join(' '))
        }
      }

      if (typeof value === 'number') {
        setBase(value)
      }

      if (typeof value !== 'number' && 'special' in value) {
        setBase(value.special)
      }

      if (typeof value !== 'number' && 'ac' in value) {
        setBase(value.ac, value.from ?? [value.condition])
      }

      return parsed
    },
    { base: undefined, detailed: [] }
  )

  return [base, detailed.length ? `(${detailed.join('; ')})` : undefined]
    .filter(Boolean)
    .join(' ')
}

export const formatAligment = (alignment: CreatureDetails['alignment']) =>
  alignment
    ?.map(alignment => ALIGNMENTS[alignment] ?? titleCase(alignment))
    .join(' ') ?? ALIGNMENTS.U

export const formatCR = (cr: number) => CR_LABELS[cr] ?? cr ?? EMPTY

export const formatDamage = <T extends DamageType>(
  damage: Array<Damage | DamageDetails> = [],
  type: T,
  condition: Condition[] = []
) => {
  const { plain, detailed } = damage.reduce(
    (parsed, value) => {
      if (typeof value === 'string') {
        parsed.plain.push(value)
      } else {
        parsed.detailed.push(
          `${formatList(value[type], { style: 'long' })} ${value.note}`
        )
      }

      return parsed
    },
    { plain: [], detailed: [] }
  )

  return [formatList(plain), ...detailed, formatList(condition)]
    .filter(Boolean)
    .join('; ')
}

export const formatDistance = (value: number) => `${value} ft.`

export const formatHP = (hp: Monster['hp']) => {
  if ('special' in hp) return hp.special

  return (
    <>
      {hp.average} (<DiceRoller>{hp.formula}</DiceRoller>)
    </>
  )
}

export const formatList = (
  list: string[],
  options: Intl.ListFormatOptions = { style: 'narrow' }
) => {
  if (!list) return EMPTY

  return new Intl.ListFormat('en-GB', options).format(list)
}

export const formatModifier = (value: number) =>
  [value > 0 ? '+' : undefined, value].join('')

export const formatPB = (level: number) =>
  formatModifier(Math.max(2, 1 + Math.round(level / 4)))

export const formatRecharge = (value?: number) => {
  return [value, 6].filter(Boolean).join('-')
}

export const formatSize = (size: Size) => SIZES[size]

export const formatSource = (source: string) => SOURCES[source]

export const formatSpeed = (speed: Speeds) =>
  formatList(
    Object.entries(speed).reduce((speeds, [key, value]) => {
      let condition = undefined

      if (typeof value !== 'number') {
        condition = value.condition
        value = value.number
      }

      const distance = formatDistance(value)

      return [
        ...speeds,
        [key !== 'walk' && key, distance, condition].filter(Boolean).join(' ')
      ]
    }, [])
  )

export const formatSpeedLimits = (level: number, locale?: string) => {
  if (level < LEVELS.walk) return EMPTY

  const limits = Object.entries(SPEEDS)
    .sort(([a], [b]) => LEVELS[a] - LEVELS[b])
    .reduce<string[]>(
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

export const formatSpellLevel = (level: number) =>
  level === 0 ? 'Cantrip' : `${level}${LEVEL_SUFFIXES[PLURALS.select(level)]}`

export const formatType = (type: CreatureType) => titleCase(type)

export const getCircleFormsCR = (level: number) =>
  Math.max(LEVELS.min, Math.floor(level / 3))

export const getModifier = (ability: number) =>
  Math.floor((ability - ABILITY_BASE) / 2)

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

export const getPassivePerception = (wis: number, perception: number) =>
  ABILITY_BASE + (perception ?? getModifier(wis))

export const getSpellCR = (spell?: Spell, level?: number) => {
  if (typeof spell?.upcast === 'boolean' && level) return level
  if (typeof spell?.maxCR === 'boolean') return spell?.level

  return spell?.maxCR
}

export const getSummonLimit = (cr: number) => {
  const min = Math.min(...(Object.keys(CR_LIMITS) as unknown as number[]))

  if (cr < min) cr = min

  return CR_LIMITS[cr]
}

export const getTypeCR = (type: CreatureType) =>
  Object.values(SPELLS).reduce<number | undefined>((cr, spell) => {
    const maxCR = getSpellCR(spell, SPELL_LEVELS.max)

    return spell.type === type && (cr === undefined || maxCR > cr) ? maxCR : cr
  }, undefined)

export const isCoreSource = (source: string) =>
  Parser.SOURCES_CORE_SUPPLEMENTS.has(source) &&
  !source.startsWith(Parser.SRC_MCVX_PREFIX) &&
  !source.startsWith(Parser.SRC_PS_PREFIX) &&
  !Parser.SOURCES_NON_STANDARD_WOTC.has(source)

export const isSpeedLimited = (level: number, speed: Speeds, type: Speed) =>
  level < LEVELS[type] && !!speed[type]

export const sortAlphabetically = <T extends string>(
  a: T,
  b: T,
  descending?: boolean
) => (descending ? sortAlphabetically(b, a) : a.localeCompare(b))

export const sortNumerically = <T extends Creature>(
  key: keyof T,
  a: T,
  b: T,
  descending?: boolean
) => {
  if (descending) return sortNumerically(key, b, a)

  const fallback = Number.MIN_SAFE_INTEGER

  return Number(a[key] ?? fallback) - Number(b[key] ?? fallback)
}

export const sortCreatures =
  <T extends Creature>(sortBy: keyof T = 'cr', descending?: boolean) =>
  (a: T, b: T) => {
    const isNumeric = ['cr', 'rating'].includes(sortBy as string)

    if (isNumeric && a[sortBy] !== b[sortBy]) {
      return sortNumerically(sortBy, a, b, descending)
    }

    if (a.name !== b.name) {
      return sortAlphabetically(a.name, b.name, !isNumeric && descending)
    }

    return sortAlphabetically(a.source, b.source)
  }
