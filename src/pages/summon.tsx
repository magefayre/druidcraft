import type { GetStaticProps, NextPage } from 'next'
import urlJoin from 'url-join'

import config from '~config'
import { loadData } from '~data/utils'
import SummonLayout, { type SummonLayoutProps } from '~layouts/summon'

const { url } = config
const meta = {
  title: 'Summon',
  description: 'TODO:',
  canonical: urlJoin(url, '/summon')
}

type Props = Omit<SummonLayoutProps, 'meta'>

const SummonPage: NextPage<Props> = props => (
  <SummonLayout meta={meta} {...props} />
)

export const getStaticProps = (async () => {
  const beasts = await loadData('beasts.json')
  const feys = await loadData('feys.json')

  return { props: { beasts, feys } }
}) satisfies GetStaticProps<Props>

export default SummonPage
