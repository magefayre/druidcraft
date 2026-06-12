import type { GetStaticProps, NextPage } from 'next'
import plur from 'plur'

import { loadData } from '~data/utils'
import SummonLayout, { type SummonLayoutProps } from '~layouts/summon'
import type { Creature, MonsterType } from '~types'
import { sortCreatures } from '~utils/creatures'
import { canonicalUrl } from '~utils/urls'

const meta = { title: 'Summon', canonical: canonicalUrl('summon') }

type Props = Omit<SummonLayoutProps, 'meta'>

const SummonPage: NextPage<Props> = props => (
  <SummonLayout meta={meta} {...props} />
)

export const getStaticProps = (async () => {
  const types: MonsterType[] = ['beast', 'dragon', 'elemental', 'fey', 'plant']
  const creatures: Record<MonsterType, Creature[]> = {} as Record<
    MonsterType,
    Creature[]
  >

  await Promise.all(
    types.map(async type => {
      creatures[type] = (
        (await loadData(`${plur(type)}.json`)) as Creature[]
      ).sort(sortCreatures)
    })
  )

  return { props: { creatures } }
}) satisfies GetStaticProps<Props>

export default SummonPage
