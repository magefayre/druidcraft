import { Tooltip } from '@newhighsco/chipset'
import type { ChangeEventHandler, FC } from 'react'

import Checkbox from '~components/Checkbox'
import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import { CR, EMPTY, LEVELS, SPEEDS } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import type { Creature, Speed } from '~types'
import {
  formatCR,
  formatSpeedLimits,
  getMaxCR,
  getSpeedLimit
} from '~utils/5etools'

const levels = Array.from(Array(LEVELS.max), (_, i) => i + 1)

type FormData = { level: number; circleForms: boolean; speed: Speed }

export type WildShapeProps = { beasts: Creature[] }

const WildShape: FC<WildShapeProps> = ({ beasts }) => {
  const [formData, setFormData, mounted] = useLocalStorage<FormData>(
    'wildshape',
    { level: LEVELS.min, circleForms: false, speed: undefined }
  )
  const { level, circleForms, speed } = formData
  const maxCR = getMaxCR(formData)

  const handleChange: ChangeEventHandler<HTMLFormElement> = ({ target }) => {
    const { name, value, checked, type } = target

    setFormData(formData => ({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (!circleForms) {
    beasts = beasts.filter(({ cr }) => cr <= CR.fly)
  }

  if (speed) {
    beasts = beasts.filter(beast => !!beast.speed[speed])
  }

  return (
    <>
      <Filter>
        <form onChange={handleChange}>
          <div>
            <label htmlFor="level">Level</label>
            <select id="level" name="level" value={level} disabled={!mounted}>
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
                disabled={!mounted}
              />
            }
            align="right"
            valign="middle"
          >
            Moon&nbsp;Druid:&nbsp;{circleForms ? 'Yes' : 'No'}
          </Tooltip>
          <div>
            <label htmlFor="speed">Speed</label>
            <select id="speed" name="speed" value={speed} disabled={!mounted}>
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
