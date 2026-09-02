import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { CreatureDetails } from '~components/Creature'
import type { CreatureDetailsProps } from '~components/Creature/types'
import { summary, url } from '~components/Creature/utils'
import PageContainer from '~components/PageContainer'
import LoadingPageContainer from '~components/PageContainer/LoadingPageContainer'
import { formatList, formatSource } from '~utils/5etools'
import { canonicalUrl } from '~utils/urls'

export type CreatureLayoutProps = CreatureDetailsProps

const CreatureLayout: NextPage<CreatureLayoutProps> = creature => {
  const { isFallback } = useRouter()

  if (isFallback) return <LoadingPageContainer />

  const { alignment, name, size, source, type } = creature
  const meta = {
    title: [name, 'Creatures'].join(' | '),
    description: formatList([
      name,
      formatSource(source),
      summary({ size, type, alignment })
    ]),
    canonical: canonicalUrl(url({ source, name }))
  }

  return (
    <PageContainer meta={meta}>
      <CreatureDetails {...creature} />
    </PageContainer>
  )
}

export default CreatureLayout
