import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { url } from '~components/Creature/utils'
import PageContainer from '~components/PageContainer'
import { loadData } from '~data/utils'
import type { Creature } from '~types'

type Props = Creature
const CreaturePage: NextPage<Props> = ({ name, ...rest }) => {
  const { isFallback } = useRouter()

  // TODO: Loading indicator
  if (isFallback) return <span>Loading...</span>

  // TODO: Meta
  const meta = { title: [name, 'Creatures'].join(' | ') }

  return (
    <PageContainer meta={meta}>
      <h1>{name}</h1>
      <pre>{JSON.stringify(rest, null, 2)}</pre>
    </PageContainer>
  )
}

export const getStaticProps = (async ({ params }) => {
  const source = params?.source as string
  const name = params?.slug as string
  const creature = await loadData<Creature>(url({ source, name }))

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
