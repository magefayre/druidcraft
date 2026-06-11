import { ContentContainer } from '@newhighsco/chipset'
import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren & { className?: string }

const Section: FC<Props> = ({ children, className }) => (
  <ContentContainer className={className}>
    <ContentContainer gutter size="desktopLarge">
      {children}
    </ContentContainer>
  </ContentContainer>
)
export default Section
