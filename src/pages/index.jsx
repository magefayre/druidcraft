import { Card, List } from '@newhighsco/chipset'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import { object } from 'prop-types'
import React from 'react'
import urlJoin from 'url-join'

import PageContainer from '~components/PageContainer'
import config from '~config'

import { loadData } from '../utils'

const { name, title, logo, socialLinks, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

const HomePage = ({ beasts, sources }) => (
  <PageContainer meta={meta}>
    <SocialProfileJsonLd
      type="Organization"
      name={name}
      url={url}
      sameAs={Object.values(socialLinks)}
    />
    {logo?.bitmap && <LogoJsonLd url={url} logo={urlJoin(url, logo.bitmap)} />}
    <List
      unstyled
      style={{
        display: 'grid',
        gap: '1em',
        gridTemplateColumns: 'repeat(auto-fit, minmax(9em, 1fr))'
      }}
    >
      {beasts.map(({ cr, name, source }) => (
        <li key={`${source}/${name}`}>
          <Card
            heading={<h2>{name}</h2>}
            image={{
              src: `/tokens/${source}/${name.normalize('NFD').replace(/\p{Diacritic}/gu, '')}`,
              width: 280,
              height: 280
            }}
          >
            <abbr title="Challenge Rating">CR</abbr> {cr}{' '}
            <abbr title={sources[source]}>{source}</abbr>
          </Card>
        </li>
      ))}
    </List>
  </PageContainer>
)

HomePage.propTypes = { meta: object }

export async function getStaticProps() {
  const beasts = await loadData('beasts.json')
  const sources = await loadData('sources.json')

  return { props: { beasts, sources } }
}

export default HomePage
