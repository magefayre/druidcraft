import { useMemo } from 'react'

import type { Option } from '~components/Select'
import { EMPTY_OPTION } from '~components/Select/constants'
import { CR, DESCENDING, LEVELS, SEPARATOR, SPEEDS } from '~constants'
import SOURCES from '~data/sources.json' with { type: 'json' }
import type { Creature } from '~types'
import { getMaxCR, sortAlphabetically, sortCreatures } from '~utils/5etools'

import type { WildShapeFormData } from './types'

export const useLevels = (circleForms: boolean) =>
  useMemo<Option[]>(
    () =>
      Array.from(Array(LEVELS.max), (_, i) => {
        const level = i + 1

        return {
          value: `${level}`,
          disabled: level < LEVELS.walk || (!circleForms && level > LEVELS.fly)
        }
      }),
    [circleForms]
  )

export const useMaxCR = ({ level, circleForms }: WildShapeFormData) =>
  useMemo(() => getMaxCR({ level, circleForms }), [level, circleForms])

export const useSources = (creatures: Creature[]) =>
  useMemo<Option[]>(
    () =>
      creatures
        .reduce<Option[]>(
          (sources, { source }) =>
            !sources.find(({ value }) => value === source)
              ? [...sources, { value: source, label: SOURCES[source] }]
              : sources,
          []
        )
        .sort((a, b) => sortAlphabetically(SOURCES[a.value], SOURCES[b.value])),
    [creatures]
  )

export const useSpeeds = (level: number) =>
  useMemo<Option[]>(
    () => [
      EMPTY_OPTION,
      ...Object.entries(SPEEDS).map(([value, { singular }]) => ({
        value,
        label: singular,
        disabled: level < (LEVELS[value] ?? LEVELS.walk)
      }))
    ],
    [level]
  )

export const useWildShapes = <T extends Creature>(
  creatures: T[],
  { circleForms, speed, source, sort }: WildShapeFormData
) =>
  useMemo<T[]>(() => {
    let filtered = creatures.filter(
      creature =>
        (!circleForms ? creature.cr <= CR.fly : true) &&
        (speed ? !!creature.speed[speed] : true) &&
        (!!source?.length ? source.includes(creature.source) : true)
    )

    if (sort) {
      const [sortBy, direction] = sort.split(SEPARATOR)

      filtered = filtered.sort(
        sortCreatures(sortBy as keyof T, direction === DESCENDING)
      )
    }

    return filtered
  }, [circleForms, speed, source, sort])
