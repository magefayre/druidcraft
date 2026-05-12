import { Grid } from '@newhighsco/chipset'
import type { ChangeEventHandler, FC } from 'react'
import React from 'react'

import { BeastList } from '~components/Beast'
import Icon from '~components/Icon/Icon'
import Section from '~components/Section'
import { CR, LEVELS } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import { ReactComponent as SpriteSvg } from '~images/sprite.svg'
import type { Beast } from '~types'
import { formatCR, formatSpeedLimits, getMaxCR } from '~utils'

import styles from './WildShape.module.scss'

const levels = Array.from(Array(LEVELS.max), (_, i) => i + 1)

type FormData = { level: number; circleForms: boolean }

export type WildShapeProps = { beasts: Beast[] }

const WildShape: FC<WildShapeProps> = ({ beasts }) => {
  const [formData, setFormData, mounted] = useLocalStorage<FormData>(
    'wildshape',
    { level: LEVELS.min, circleForms: false }
  )

  const { level, circleForms } = formData
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

  return (
    <>
      <Section className={styles.header}>
        <Grid flex className={styles.headerContent}>
          <Grid.Item className={styles.fieldset}>
            <form onChange={handleChange}>
              <label>
                <span>Level</span>
                <select name="level" value={level} disabled={!mounted}>
                  {levels.map(level => (
                    <option
                      key={level}
                      value={level}
                      disabled={
                        level === LEVELS.min ||
                        (!circleForms && level > LEVELS.fly)
                      }
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <Icon name="moon" width={64} alt="Moon Druid" />
                <input
                  name="circleForms"
                  type="checkbox"
                  checked={circleForms}
                  disabled={!mounted}
                />
              </label>
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
        <SpriteSvg />
      </Section>
    </>
  )
}

export default WildShape
