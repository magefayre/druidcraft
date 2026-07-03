import { Icon, Tooltip } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import { RATINGS } from '~constants'
import sprite from '~images/sprite.svg'

import styles from './Rating.module.scss'

type Props = PropTypes.InferProps<Tooltip.propTypes>

const Rating: FC<Props> = ({ children, ...rest }) => {
  if (!children) return null

  const rating = Number(children)

  return (
    <Tooltip
      theme={{ toggle: styles.root }}
      toggle={Object.values(RATINGS).map(value => (
        <Icon
          key={value}
          aria-disabled={value > rating ? true : undefined}
          className={styles.icon}
        >
          <svg>
            <use xlinkHref={`${sprite}#star`} />
          </svg>
        </Icon>
      ))}
      {...rest}
    >
      {rating} Star Rating
    </Tooltip>
  )
}

export default Rating
