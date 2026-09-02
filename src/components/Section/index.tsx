import { ContentContainer } from '@newhighsco/chipset'
import { classNames } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import styles from './Section.module.scss'

type Props = PropTypes.InferProps<ContentContainer.propTypes>

const Section: FC<Props> = ({ className, theme, ...rest }) => (
  <ContentContainer
    className={classNames(styles.root, className)}
    theme={{ root: theme?.root }}
  >
    <ContentContainer
      gutter
      size="desktopLarge"
      theme={{ content: theme?.content }}
      {...rest}
    />
  </ContentContainer>
)
export default Section
