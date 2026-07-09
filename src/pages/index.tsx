import type { GetStaticProps, NextPage } from 'next'

import config from '~config'
import SOURCES from '~data/sources.json' with { type: 'json' }
import { loadCreatures } from '~data/utils'
import HomeLayout, { type HomeLayoutProps } from '~layouts/home'
import { canonicalUrl } from '~utils/urls'

const { title } = config
const meta = { canonical: canonicalUrl(), customTitle: true, title }

type Props = Omit<HomeLayoutProps, 'meta'>

const HomePage: NextPage<Props> = props => <HomeLayout meta={meta} {...props} />

export const getStaticProps = (async () => {
  const creatures = await loadCreatures('beast', {
    beast: ({ spell }) => !spell
  })
  const sources = Object.keys(SOURCES).filter(key =>
    creatures.beast.some(({ source }) => source === key)
  )

  return { props: { creatures, sources } }
}) satisfies GetStaticProps<Props>

export default HomePage
