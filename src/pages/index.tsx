import type { GetStaticProps, NextPage } from 'next'

import config from '~config'
import { loadCreatures } from '~data/utils'
import HomeLayout, { type HomeLayoutProps } from '~layouts/home'
import type { Source } from '~types'
import { canonicalUrl } from '~utils/urls'

const { title } = config
const meta = { canonical: canonicalUrl(), customTitle: true, title }

type Props = Omit<HomeLayoutProps, 'meta'>

const HomePage: NextPage<Props> = props => <HomeLayout meta={meta} {...props} />

export const getStaticProps = (async () => {
  const creatures = await loadCreatures('beast', {
    beast: ({ spell }) => !spell
  })
  const sources = creatures.beast
    .reduce<Source[]>(
      (sources, { source }) =>
        !sources.includes(source) ? [...sources, source] : sources,
      []
    )
    .sort()

  return { props: { creatures, sources } }
}) satisfies GetStaticProps<Props>

export default HomePage
