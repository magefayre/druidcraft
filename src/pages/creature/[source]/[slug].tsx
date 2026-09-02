import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { slugifyName, slugifySource, url } from '~components/Creature/utils'
import { loadCreatures, loadData } from '~data/utils'
import type { CreatureLayoutProps } from '~layouts/creature'
import CreatureLayout from '~layouts/creature'
import type { CreatureDetails } from '~types'

const CreaturePage: NextPage<CreatureLayoutProps> = props => (
  <CreatureLayout {...props} />
)

export const getStaticProps = (async ({ params }) => {
  const source = params?.source as string
  const name = params?.slug as string
  const creature = await loadData<CreatureDetails>(url({ source, name }, false))

  if (!creature) {
    return { notFound: true }
  }

  return { props: creature, revalidate: 60 }
}) satisfies GetStaticProps

export const getStaticPaths = (async () => {
  const creatures = Object.values(
    await loadCreatures(['beast', 'dragon', 'elemental', 'fey', 'plant'])
  ).flat()
  const paths = creatures.map(({ source, name }) => ({
    params: { source: slugifySource(source), slug: slugifyName(name) }
  }))

  return { paths, fallback: true }
}) satisfies GetStaticPaths

export default CreaturePage
