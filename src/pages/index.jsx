import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { Card, List } from '@newhighsco/chipset'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import { object } from 'prop-types'
import React from 'react'
import urlJoin from 'url-join'

import PageContainer from '~components/PageContainer'
import config from '~config'

const { name, title, logo, socialLinks, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

const HomePage = ({ beasts }) => (
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
        <li key={name}>
          <Card
            heading={<h2>{name}</h2>}
            image={{
              // src: `https://2014.5e.tools/img/bestiary/tokens/${source}/${name}.webp`,
              src: `https://raw.githubusercontent.com/5etools-mirror-3/5etools-2014-img/main/bestiary/${source}/${name}.webp`,
              // src: `https://www.aidedd.org/dnd/images/${name}.jpg`,
              width: 100,
              height: 100,
              onError: e => (e.target.style.display = 'none')
            }}
          >
            <abbr title="Challenge Rating">CR: {cr}</abbr> <abbr>{source}</abbr>
          </Card>
        </li>
      ))}
    </List>
  </PageContainer>
)

HomePage.propTypes = { meta: object }

export async function getStaticProps() {
  const beasts = await readFile(
    join(process.cwd(), 'src/data/beasts.json'),
    'utf8'
  ).then(content => JSON.parse(content))

  return { props: { beasts } }
}

export default HomePage
