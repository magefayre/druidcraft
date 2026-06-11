import type { GetStaticProps, NextPage } from 'next'

import { loadData } from '~data/utils'
import SummonLayout, { type SummonLayoutProps } from '~layouts/summon'
import { canonicalUrl } from '~utils/urls'

const meta = {
  title: 'Summon',
  description: 'TODO:',
  canonical: canonicalUrl('summon')
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
