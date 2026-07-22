import { useMemo } from 'react'

import type { Option } from '~components/Select'
import { EMPTY_OPTION } from '~components/Select/constants'
import { DESCENDING, SEPARATOR, SPELL_LEVELS, SPELLS } from '~constants'
import type { Creature, MonsterType, Spell } from '~types'
import { formatSpellLevel, getSpellCR, sortCreatures } from '~utils/5etools'

import type { SummonFormData } from './types'

const getUpcastLevels = ({ level, upcast }: Spell) => {
  if (typeof upcast === 'boolean') {
    return Array.from(
      { length: SPELL_LEVELS.max - level },
      (_, index) => level + index + 1
    )
  }

  return Object.keys(upcast)
}

export const useMaxCR = (spell?: Spell, level?: number) =>
  useMemo(() => getSpellCR(spell, level), [spell, level])

export const useSpells = () =>
  useMemo<Option[]>(
    () => [
      EMPTY_OPTION,
      ...Object.entries(SPELLS).map(([value, { level }]) => ({
        value,
        label: `${value} (${formatSpellLevel(level)})`
      }))
    ],
    []
  )

export const useSummons = <T extends Creature>({
  creatures,
  filters,
  maxCR,
  selected: { sort, spell }
}: {
  creatures: Record<MonsterType, T[]>
  filters?: Spell
  maxCR?: number
  selected?: SummonFormData
}) =>
  useMemo(() => {
    let filtered = creatures[filters?.type]?.filter(
      creature =>
        (maxCR ? creature.cr <= maxCR : true) &&
        (filters?.spell
          ? creature.spell?.toLowerCase() === spell.toLowerCase()
          : !creature.spell) &&
        (filters?.creatures
          ? Object.keys(filters.creatures).includes(creature.name)
          : true)
    )

    if (sort) {
      const [sortBy, direction] = sort.split(SEPARATOR)

      filtered = filtered?.sort(
        sortCreatures(sortBy as keyof T, direction === DESCENDING)
      )
    }

    return filtered
  }, [filters, maxCR, sort, spell])

export const useUpcasting = (spell?: Spell) =>
  useMemo<Option[]>(
    () =>
      !!spell?.upcast
        ? [
            EMPTY_OPTION,
            ...getUpcastLevels(spell).map(level => ({
              value: `${level}`,
              label: formatSpellLevel(level)
            }))
          ]
        : undefined,
    [spell]
  )
