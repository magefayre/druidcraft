import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import PageContainer from '~components/PageContainer'
import type { Creature } from '~types'

type Props = Creature
const CreaturePage: NextPage<Props> = ({ name, source }) => {
  const { isFallback } = useRouter()

  // TODO: Loading indicator
  if (isFallback) return <span>Loading...</span>

  // TODO: Meta
  const meta = { title: [name, 'Creatures'].join(' | ') }

  return (
    <PageContainer meta={meta}>
      Creature: {name} | Source: {source}
    </PageContainer>
  )
}

export const getStaticProps = (async ({ params }) => {
  const source = params?.source
  const name = params?.slug
  const creature: Creature = { name, source }

  if (!creature) {
    return { notFound: true }
  }

  return { props: creature, revalidate: 60 }
}) satisfies GetStaticProps

export const getStaticPaths = (async () => {
  // TODO: Determine top creatures
  const creatures = []
  const paths = creatures.map(({ slug, source }) => ({
    params: { source, slug }
  }))

  return { paths, fallback: true }
}) satisfies GetStaticPaths

export default CreaturePage
