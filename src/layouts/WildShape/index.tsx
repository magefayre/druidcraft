import { Grid } from '@newhighsco/chipset'
import type { NextPage } from 'next'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import type { ChangeEventHandler } from 'react'
import React, { useEffect, useState } from 'react'
import urlJoin from 'url-join'

import { BeastList } from '~components/Beast'
import PageContainer, {
  type PageContainerProps
} from '~components/PageContainer'
import Section from '~components/Section'
import config from '~config'
import { CR, LEVELS } from '~constants'
import type { Beast } from '~types'
import { formatCR, formatSpeedLimits, getMaxCR } from '~utils'

import styles from './index.module.scss'

const { name, logo, socialLinks, url } = config
const levels = Array.from(Array(LEVELS.max), (_, i) => i + 1)

export type WildShapeLayoutProps = {
  beasts: Beast[]
  meta: PageContainerProps['meta']
}

const WildShapeLayout: NextPage<WildShapeLayoutProps> = ({ beasts, meta }) => {
  const [formData, setFormData] = useState({
    level: LEVELS.min,
    circleForms: false
  })
  const { level, circleForms } = formData
  const [maxCR, setMaxCR] = useState(getMaxCR(formData))

  useEffect(() => {
    setMaxCR(getMaxCR(formData))
  }, [formData])

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
    <PageContainer meta={meta}>
      <SocialProfileJsonLd
        type="Organization"
        name={name}
        url={url}
        sameAs={Object.values(socialLinks)}
      />
      {logo?.bitmap && (
        <LogoJsonLd url={url} logo={urlJoin(url, logo.bitmap)} />
      )}
      <Section className={styles.header}>
        <Grid flex className={styles.headerContent}>
          <Grid.Item className={styles.fieldset}>
            <form onChange={handleChange}>
              <label>
                <span>Level</span>
                <select name="level" defaultValue={level}>
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
                <span>Circle Forms</span>
                <input
                  name="circleForms"
                  type="checkbox"
                  defaultChecked={circleForms}
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
      </Section>
    </PageContainer>
  )
}

export default WildShapeLayout
