import { ContentContainer } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

type Props = PropTypes.InferProps<ContentContainer.propTypes>

const Section: FC<Props> = ({ children, className, theme }) => (
  <ContentContainer className={className} theme={{ root: theme?.root }}>
    <ContentContainer
      gutter
      size="desktopLarge"
      theme={{ content: theme?.content }}
    >
      {children}
    </ContentContainer>
  </ContentContainer>
)
export default Section
