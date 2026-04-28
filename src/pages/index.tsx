import { Grid } from '@newhighsco/chipset'
import type { GetStaticProps, NextPage } from 'next'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import type { ChangeEventHandler } from 'react'
import React, { useEffect, useState } from 'react'
import urlJoin from 'url-join'

import { BeastList } from '~components/Beast'
import PageContainer from '~components/PageContainer'
import config from '~config'
import { CR, LEVELS } from '~constants'
import { loadData } from '~data/utils'
import type { Beast } from '~types'
import { formatCR, formatSpeedLimits, getMaxCR } from '~utils'

const { name, title, logo, socialLinks, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

type Props = { beasts: Beast[] }

const HomePage: NextPage<Props> = ({ beasts }) => {
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
      [name]: type === 'checkbox' ? checked : Number(value)
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
      <Grid reverse flex style={{ gap: '0.5em' }}>
        <Grid.Item sizes={['tablet-one-half']}>
          <form onChange={handleChange}>
            <label>
              <span>Level</span>
              <input
                name="level"
                type="number"
                min={LEVELS.min}
                max={LEVELS.max}
                defaultValue={level}
              />
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
        <Grid.Item sizes={['tablet-one-half']}>
          <dl>
            <dt>Max. CR</dt>
            <dd>{formatCR(maxCR)}</dd>
            <dt>Limitations</dt>
            <dd>{formatSpeedLimits(level)}</dd>
          </dl>
        </Grid.Item>
      </Grid>
      <BeastList beasts={beasts} level={level} maxCR={maxCR} />
    </PageContainer>
  )
}

export const getStaticProps = (async () => {
  const beasts = await loadData('beasts.json')

  return { props: { beasts } }
}) satisfies GetStaticProps<Props>

export default HomePage
