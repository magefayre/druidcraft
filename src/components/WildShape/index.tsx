import { Grid } from '@newhighsco/chipset'
import type { ChangeEventHandler, FC } from 'react'
import React from 'react'

import { BeastList } from '~components/Beast'
import Checkbox from '~components/Checkbox'
import Section from '~components/Section'
import { CR, EMPTY, LEVELS, SPEEDS } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import type { Beast, Speed } from '~types'
import { formatCR, formatSpeedLimits, getMaxCR } from '~utils'

import styles from './WildShape.module.scss'

const levels = Array.from(Array(LEVELS.max), (_, i) => i + 1)

type FormData = { level: number; circleForms: boolean; speed: Speed }

export type WildShapeProps = { beasts: Beast[] }

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
      <Section className={styles.header}>
        <Grid flex className={styles.headerContent}>
          <Grid.Item className={styles.fieldset}>
            <form onChange={handleChange}>
              <label htmlFor="level">Level</label>
              <select id="level" name="level" value={level} disabled={!mounted}>
                {levels.map(level => (
                  <option
                    key={level}
                    value={level}
                    disabled={
                      level < LEVELS.walk ||
                      (!circleForms && level > LEVELS.fly)
                    }
                  >
                    {level}
                  </option>
                ))}
              </select>
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
              <Checkbox
                name="circleForms"
                icon={['boxicons:moon', circleForms && 'filled']
                  .filter(Boolean)
                  .join('-')}
                alt="Moon Druid"
                checked={circleForms}
                disabled={!mounted}
              />
            </form>
          </Grid.Item>
          <Grid.Item className={styles.filters}>
            <dl>
              <dt>Max. CR</dt>
              <dd>{formatCR(maxCR)}</dd>
              <dt>Limitations</dt>
              <dd>{formatSpeedLimits(level)}</dd>
            </dl>
          </Grid.Item>
        </Grid>
      </Section>
      <Section>
        <BeastList beasts={beasts} level={level} maxCR={maxCR} />
      </Section>
    </>
  )
}

export default WildShape
