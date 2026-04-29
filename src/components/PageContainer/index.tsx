import { PageContainer as ThemedPageContainer } from '@newhighsco/chipset'
import { Meta } from '@newhighsco/press-start'
import type { NextSeoProps } from 'next-seo'
import React, { type FC, type PropsWithChildren } from 'react'

import Footer from '~components/Footer'
import Header from '~components/Header'

export type PageContainerProps = PropsWithChildren<{ meta: NextSeoProps }>

const PageContainer: FC<PageContainerProps> = ({ meta, children }) => (
  <ThemedPageContainer header={<Header />} footer={<Footer />}>
    <Meta {...meta} />
    {children}
  </ThemedPageContainer>
)

export default PageContainer
export { PageContainer }
