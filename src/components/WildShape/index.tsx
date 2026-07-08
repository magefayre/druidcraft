import type { FC } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import Checkbox from '~components/Checkbox'
import { CreatureList } from '~components/Creature'
import type { FilterHandler } from '~components/Filter'
import Filter from '~components/Filter'
import Section from '~components/Section'
import Select from '~components/Select'
import { CR, LEVELS, SPEEDS } from '~constants'
import SOURCES from '~data/sources.json' with { type: 'json' }
import type { Creature, MonsterType, Source, Speed } from '~types'
import {
  formatCR,
  formatSpeedLimits,
  getMaxCR,
  getSpeedLimit,
  sortCreatures
} from '~utils/5etools'

import { DESCENDING, SEPARATOR, SORTING } from './constants'

const levels = Array.from(Array(LEVELS.max), (_, i) => i + 1)

type FormData = {
  level: number
  circleForms: boolean
  sort: string
  source: string[]
  speed: Speed
}

export type WildShapeProps = {
  creatures: Record<Extract<MonsterType, 'beast'>, Creature[]>
  sources: Source[]
}

const WildShape: FC<WildShapeProps> = ({ creatures, sources }) => {
  const [formData, setFormData] = useLocalStorage<FormData>(
    'wildshape',
    {
      level: LEVELS.walk,
      circleForms: false,
      sort: 'cr',
      source: undefined,
      speed: undefined
    },
    { initializeWithValue: false }
  )

  const handleChange: FilterHandler = (id, value) => {
    setFormData(formData => ({ ...formData, [id]: value }))
  }

  const { level, circleForms, sort, source, speed } = formData
  const maxCR = getMaxCR(formData)
  let beasts = creatures.beast

  if (!circleForms) {
    beasts = beasts.filter(({ cr }) => cr <= CR.fly)
  }

  if (speed) {
    beasts = beasts.filter(beast => !!beast.speed[speed])
  }

  if (!!source?.length) {
    beasts = beasts.filter(beast => source.includes(beast.source))
  }

  if (sort) {
    const [sortBy, direction] = sort.split(SEPARATOR)

    beasts = beasts.sort(sortCreatures(sortBy as keyof Creature))

    if (direction === DESCENDING) {
      beasts = beasts.reverse()
    }
  }

  return (
    <>
      <Filter>
        <form>
          <Checkbox
            id="circleForms"
            label="Moon Druid"
            icon={['boxicons:moon', circleForms && 'filled']
              .filter(Boolean)
              .join('-')}
            checked={circleForms}
            onChange={handleChange}
          />
          <Select
            id="level"
            label="Level"
            value={`${level}`}
            onChange={handleChange}
            options={levels.map(value => ({
              value: `${value}`,
              disabled:
                value < LEVELS.walk || (!circleForms && value > LEVELS.fly)
            }))}
          />
          <Select
            id="speed"
            label="Speed"
            value={speed}
            onChange={handleChange}
            options={[
              { value: '' },
              ...Object.entries(SPEEDS).map(([value, { singular }]) => ({
                value,
                label: singular,
                disabled: level < (LEVELS[value] ?? LEVELS.walk)
              }))
            ]}
          />
          <Select
            id="source"
            label="Source"
            value={source}
            onChange={handleChange}
            multiple
            options={sources.map(value => ({ value, label: SOURCES[value] }))}
          />
          <Select
            id="sort"
            label="Sort"
            value={sort}
            onChange={handleChange}
            options={Object.entries(SORTING).reduce(
              (options, [key, { min, max }]) => {
                const value = key.toLowerCase()
                const label = (a: string, b: string) => `${key}: ${a}-${b}`

                return [
                  ...options,
                  { value, label: label(min, max) },
                  {
                    value: [value, DESCENDING].join(SEPARATOR),
                    label: label(max, min)
                  }
                ]
              },
              []
            )}
          />
        </form>
        <dl>
          <dt>Max. CR</dt>
          <dd>{formatCR(maxCR)}</dd>
          <dt>Limitations</dt>
          <dd>{formatSpeedLimits(level)}</dd>
        </dl>
      </Filter>
      <Section>
        <CreatureList
          creatures={beasts}
          isCreatureDisabled={({ cr, speed }) =>
            !maxCR ||
            cr > maxCR ||
            getSpeedLimit(level, speed, 'swim') ||
            getSpeedLimit(level, speed, 'fly')
          }
          speedLimits
        />
      </Section>
    </>
  )
}

export default WildShape
