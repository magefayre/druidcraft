import type { GetStaticProps, NextPage } from 'next'
import urlJoin from 'url-join'

import config from '~config'
import { loadData } from '~data/utils'
import HomeLayout, { type HomeLayoutProps } from '~layouts/home'

const { title, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

type Props = Omit<HomeLayoutProps, 'meta'>

const HomePage: NextPage<Props> = props => <HomeLayout meta={meta} {...props} />

export const getStaticProps = (async () => {
  const beasts = await loadData('beasts.json')

  return { props: { beasts } }
}) satisfies GetStaticProps<Props>

export default HomePage
