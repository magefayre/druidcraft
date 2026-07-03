import type { GetStaticProps, NextPage } from 'next'

import config from '~config'
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

  return { props: { creatures } }
}) satisfies GetStaticProps<Props>

export default HomePage
