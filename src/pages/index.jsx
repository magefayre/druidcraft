import { Card, Grid, List } from '@newhighsco/chipset'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import { object } from 'prop-types'
import React, { useEffect, useState } from 'react'
import urlJoin from 'url-join'

import PageContainer from '~components/PageContainer'
import config from '~config'

import { loadData } from '../data/utils'

const CR = { 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' }
const EMPTY = '-'
const LEVELS = { min: 1, max: 20, walk: 2, swim: 4, fly: 8 }
const SUFFIXES = { one: 'st', two: 'nd', few: 'rd', other: 'th' }
const VERBS = { swim: 'Swims', fly: 'Flies' }

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' })
const { name, title, logo, socialLinks, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

const formatCR = cr => CR[cr] ?? cr ?? EMPTY

const formatSpeedLimits = level => {
  if (level < LEVELS.walk) return EMPTY
  if (level < LEVELS.swim) return 'No flying or swimming speed'
  if (level < LEVELS.fly) return 'No flying speed'

  return EMPTY
}

const formatOrdinals = n => {
  const suffix = SUFFIXES[pr.select(n)]

  return `${n}${suffix}`
}

const getMaxCR = ({ level, circleForms = false }) => {
  if (circleForms && level >= LEVELS.walk) {
    return Math.max(LEVELS.min, Math.floor(level / 3))
  }

  if (level >= LEVELS.fly) return 1
  if (level >= LEVELS.swim) return 0.5
  if (level >= LEVELS.walk) return 0.25

  return null
}

const HomePage = ({ beasts, sources }) => {
  const [formData, setFormData] = useState({
    level: LEVELS.min,
    circleForms: false
  })
  const { level, circleForms } = formData
  const [maxCR, setMaxCR] = useState(getMaxCR(formData))

  useEffect(() => {
    setMaxCR(getMaxCR(formData))
  }, [formData])

  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target

    setFormData(formData => ({
      ...formData,
      [name]: type === 'checkbox' ? checked : Number(value)
    }))
  }

  if (!circleForms) {
    beasts = beasts.filter(({ cr }) => cr <= 1)
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
                value={level}
              />
            </label>
            <label>
              <span>Circle Forms</span>
              <input name="circleForms" type="checkbox" checked={circleForms} />
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
      <List
        unstyled
        style={{
          display: 'grid',
          gap: '1em',
          gridTemplateColumns: 'repeat(auto-fit, minmax(9em, 1fr))'
        }}
      >
        {beasts.map(({ cr, name, source, speed }) => {
          const formatSpeed = key =>
            !!speed[key] && (
              <abbr title={`Requires ${formatOrdinals(LEVELS[key])} level`}>
                {VERBS[key]}
              </abbr>
            )
          const speedLimit = key => level < LEVELS[key] && !!speed[key]
          const disabled =
            !maxCR || cr > maxCR || speedLimit('swim') || speedLimit('fly')

          return (
            <li key={`${source}/${name}`}>
              <Card
                heading={<h2>{name}</h2>}
                image={{
                  src: `/tokens/${source}/${name.normalize('NFD').replace(/\p{Diacritic}/gu, '')}`,
                  width: 280,
                  height: 280
                }}
                disabled={disabled}
              >
                <abbr title="Challenge Rating">CR {formatCR(cr)}</abbr>
                <abbr title={sources[source]}>{source}</abbr>
                {formatSpeed('swim')}
                {formatSpeed('fly')}
              </Card>
            </li>
          )
        })}
      </List>
    </PageContainer>
  )
}

HomePage.propTypes = { meta: object }

export async function getStaticProps() {
  const beasts = await loadData('beasts.json')
  const sources = await loadData('sources.json')

  return { props: { beasts, sources } }
}

export default HomePage
