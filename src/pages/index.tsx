import type { GetStaticProps, NextPage } from 'next'
import urlJoin from 'url-join'

import config from '~config'
import { loadData } from '~data/utils'
import Layout, { type WildShapeLayoutProps } from '~layouts/WildShape'

const { title, url } = config
const meta = { canonical: urlJoin(url, '/'), customTitle: true, title }

type Props = Omit<WildShapeLayoutProps, 'meta'>

const HomePage: NextPage<Props> = props => <Layout meta={meta} {...props} />

export const getStaticProps = (async () => {
  const beasts = await loadData('beasts.json')

  return { props: { beasts } }
}) satisfies GetStaticProps<Props>

export default HomePage
