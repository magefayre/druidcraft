import type { NextPage } from 'next'
import { LogoJsonLd, SocialProfileJsonLd } from 'next-seo'

import PageContainer, {
  type PageContainerProps
} from '~components/PageContainer'
import type { WildShapeProps } from '~components/WildShape'
import WildShape from '~components/WildShape'
import config from '~config'
import { canonicalUrl } from '~utils/urls'

const { name, logo, socialLinks, url } = config

export type HomeLayoutProps = WildShapeProps & Pick<PageContainerProps, 'meta'>

const HomeLayout: NextPage<HomeLayoutProps> = ({ creatures, meta }) => (
  <PageContainer meta={meta}>
    <SocialProfileJsonLd
      type="Organization"
      name={name}
      url={url}
      sameAs={Object.values(socialLinks)}
    />
    {logo?.bitmap && <LogoJsonLd url={url} logo={canonicalUrl(logo.bitmap)} />}
    <WildShape creatures={creatures} />
  </PageContainer>
)

export default HomeLayout
