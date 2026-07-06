import { Tooltip } from '@newhighsco/chipset'
import { type ChangeEventHandler, type FC, Fragment } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import Checkbox from '~components/Checkbox'
import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import { CR, EMPTY, LEVELS, SPEEDS } from '~constants'
import type { Creature, MonsterType, Speed } from '~types'
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
  speed: Speed
}

export type WildShapeProps = {
  creatures: Record<Extract<MonsterType, 'beast'>, Creature[]>
}

const WildShape: FC<WildShapeProps> = ({ creatures }) => {
  const [formData, setFormData] = useLocalStorage<FormData>(
    'wildshape',
    {
      level: LEVELS.walk,
      circleForms: false,
      sort: undefined,
      speed: undefined
    },
    { initializeWithValue: false }
  )

  const handleChange: ChangeEventHandler<
    HTMLSelectElement | HTMLFormElement
  > = ({ target }) => {
    const { name, type } = target
    let { value } = target

    if (type === 'checkbox') {
      value = (target as HTMLFormElement).checked
    }

    setFormData(formData => ({ ...formData, [name]: value }))
  }

  const { level, circleForms, sort, speed } = formData
  const maxCR = getMaxCR(formData)
  let beasts = creatures.beast

  if (!circleForms) {
    beasts = beasts.filter(({ cr }) => cr <= CR.fly)
  }

  if (speed) {
    beasts = beasts.filter(beast => !!beast.speed[speed])
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
          <div>
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={level}
              onChange={handleChange}
            >
              {levels.map(level => (
                <option
                  key={level}
                  value={level}
                  disabled={
                    level < LEVELS.walk || (!circleForms && level > LEVELS.fly)
                  }
                >
                  {level}
                </option>
              ))}
            </select>
          </div>
          <Tooltip
            manual={false}
            toggle={
              <Checkbox
                name="circleForms"
                icon={['boxicons:moon', circleForms && 'filled']
                  .filter(Boolean)
                  .join('-')}
                alt="Moon Druid"
                checked={circleForms}
                onChange={handleChange}
              />
            }
            align="right"
            valign="middle"
          >
            Moon&nbsp;Druid:&nbsp;{circleForms ? 'Yes' : 'No'}
          </Tooltip>
          <div>
            <label htmlFor="speed">Speed</label>
            <select
              id="speed"
              name="speed"
              value={speed}
              onChange={handleChange}
            >
              <option value="">{EMPTY}</option>
              {Object.entries(SPEEDS).map(([key, { singular }]) => (
                <option
                  key={key}
                  value={key}
                  disabled={level < (LEVELS[key] ?? LEVELS.walk)}
                >
                  {singular}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort">Sort</label>
            <select id="sort" name="sort" value={sort} onChange={handleChange}>
              {Object.entries(SORTING).map(([key, { min, max }]) => {
                const value = key.toLowerCase()
                const label = (a: string | number, b: string | number) =>
                  `${key}: ${a}-${b}`

                return (
                  <Fragment key={key}>
                    <option value={value}>{label(min, max)}</option>
                    <option value={[value, DESCENDING].join(SEPARATOR)}>
                      {label(max, min)}
                    </option>
                  </Fragment>
                )
              })}
            </select>
          </div>
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
