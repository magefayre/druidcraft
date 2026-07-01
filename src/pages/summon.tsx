import type { GetStaticProps, NextPage } from 'next'
import plur from 'plur'

import { SPELLS } from '~constants'
import { loadData } from '~data/utils'
import SummonLayout, { type SummonLayoutProps } from '~layouts/summon'
import type { Creature, MonsterType } from '~types'
import { sortCreatures } from '~utils/5etools'
import { canonicalUrl } from '~utils/urls'

const meta = {
  title: 'Summon',
  description:
    'Druid summoning spells - Never struggle with choosing what to summon as a Druid in D&D 5e again',
  canonical: canonicalUrl('summon')
}

type Props = Omit<SummonLayoutProps, 'meta'>

const SummonPage: NextPage<Props> = props => (
  <SummonLayout meta={meta} {...props} />
)

export const getStaticProps = (async () => {
  const types = Object.values(SPELLS).reduce<MonsterType[]>(
    (types, { type }) => (!types.includes(type) ? [...types, type] : types),
    []
  )
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
