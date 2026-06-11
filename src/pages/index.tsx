import type { GetStaticProps, NextPage } from 'next'

import config from '~config'
import { loadData } from '~data/utils'
import HomeLayout, { type HomeLayoutProps } from '~layouts/home'
import { canonicalUrl } from '~utils/urls'

const { title } = config
const meta = { canonical: canonicalUrl(), customTitle: true, title }

type Props = Omit<HomeLayoutProps, 'meta'>

const HomePage: NextPage<Props> = props => <HomeLayout meta={meta} {...props} />

export const getStaticProps = (async () => {
  const beasts = await loadData('beasts.json')

  return { props: { beasts } }
}) satisfies GetStaticProps<Props>

export default HomePage
