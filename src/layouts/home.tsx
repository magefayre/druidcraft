import type { NextPage } from 'next'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'
import React from 'react'
import urlJoin from 'url-join'

import PageContainer, {
  type PageContainerProps
} from '~components/PageContainer'
import type { WildShapeProps } from '~components/WildShape'
import WildShape from '~components/WildShape'
import config from '~config'

const { name, logo, socialLinks, url } = config

export type HomeLayoutProps = {
  beasts: WildShapeProps['beasts']
  meta: PageContainerProps['meta']
}

const HomeLayout: NextPage<HomeLayoutProps> = ({ beasts, meta }) => (
  <PageContainer meta={meta}>
    <SocialProfileJsonLd
      type="Organization"
      name={name}
      url={url}
      sameAs={Object.values(socialLinks)}
    />
    {logo?.bitmap && <LogoJsonLd url={url} logo={urlJoin(url, logo.bitmap)} />}
    <WildShape beasts={beasts} />
  </PageContainer>
)

export default HomeLayout
