import { Icon, Tooltip } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import sprite from '~images/sprite.svg'

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
        <Icon alt={alt} className={styles.icon} data-rating={rating}>
          <svg>
            <use xlinkHref={`${sprite}#rating`} />
          </svg>
        </Icon>
      }
      {...rest}
    >
      {alt}
    </Tooltip>
  )
}

export default Rating
