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
      theme={{ toggle: styles.root }}
      toggle={
        <Sprite
          id="rating"
          alt={alt}
          className={styles.icon}
          data-rating={rating}
        />
      }
      {...rest}
    >
      {alt}
    </Tooltip>
  )
}

export default Rating
