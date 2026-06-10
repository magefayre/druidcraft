import type { NextPage } from 'next'
import React from 'react'

import PageContainer, {
  type PageContainerProps
} from '~components/PageContainer'

export type SummonLayoutProps = { meta: PageContainerProps['meta'] }

const SummonLayout: NextPage<SummonLayoutProps> = ({ meta }) => (
  <PageContainer meta={meta}>
    <p>TODO:</p>
  </PageContainer>
)

export default SummonLayout
