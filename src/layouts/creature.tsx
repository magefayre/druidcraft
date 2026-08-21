import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { CreatureDetails } from '~components/Creature'
import type { CreatureDetailsProps } from '~components/Creature/types'
import { url } from '~components/Creature/utils'
import PageContainer from '~components/PageContainer'
import Section from '~components/Section'
import { canonicalUrl } from '~utils/urls'

export type CreatureLayoutProps = CreatureDetailsProps

const CreatureLayout: NextPage<CreatureLayoutProps> = creature => {
  const { isFallback } = useRouter()

  // TODO: Loading indicator
  if (isFallback) return <span>Loading...</span>

  const { name, source } = creature
  const meta = {
    title: [name, 'Creatures'].join(' | '),
    description: 'TODO: description',
    canonical: canonicalUrl(url({ source, name }))
  }

  return (
    <PageContainer meta={meta}>
      <Section>
        <CreatureDetails {...creature} />
      </Section>
    </PageContainer>
  )
}

export default CreatureLayout
