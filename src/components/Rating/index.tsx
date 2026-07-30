import { Tooltip } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import Sprite from '~components/Sprite'

import styles from './Rating.module.scss'

type Props = PropTypes.InferProps<Tooltip.propTypes>

const Rating: FC<Props> = ({ children, ...rest }) => {
  if (!children) return null

  const rating = Number(children)
  const alt = `${rating} Star Rating`

  return (
    <Tooltip
      described={false}
      theme={{ toggle: styles.root }}
      toggle={
        <Sprite id="rating" className={styles.icon} data-rating={rating} />
      }
      {...rest}
    >
      {alt}
    </Tooltip>
  )
}

export default Rating
