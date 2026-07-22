import type { NextPage } from 'next'

import PageContainer, {
  type PageContainerProps
} from '~components/PageContainer'
import Summon from '~components/Summon'
import type { SummonProps } from '~components/Summon/types'

export type SummonLayoutProps = SummonProps & Pick<PageContainerProps, 'meta'>

const SummonLayout: NextPage<SummonLayoutProps> = ({ creatures, meta }) => (
  <PageContainer meta={meta}>
    <Summon creatures={creatures} />
  </PageContainer>
)

export default SummonLayout
