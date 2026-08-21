import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { url } from '~components/Creature/utils'
import { loadData } from '~data/utils'
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
  const creatures = []
  const paths = creatures.map(({ slug, source }) => ({
    params: { source, slug }
  }))

  return { paths, fallback: true }
}) satisfies GetStaticPaths

export default CreaturePage
