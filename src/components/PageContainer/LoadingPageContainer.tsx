import type { FC } from 'react'

import Section from '~components/Section'

import PageContainer, { type PageContainerProps } from '.'

const LoadingPageContainer: FC<PageContainerProps> = props => (
  <PageContainer {...props}>
    <Section role="progressbar" aria-busy="true" aria-live="polite">
      Loading...
    </Section>
  </PageContainer>
)

export default LoadingPageContainer
