import { classNames, Icon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import styles from './Sprite.module.scss'
import sprite from './sprite.svg'

type Props = PropTypes.InferProps<Icon.propTypes>

const Sprite: FC<Props> = ({ id, className, ...rest }) => (
  <Icon className={classNames(styles.root, className)} {...rest}>
    <svg>
      <use xlinkHref={`${sprite}#${id}`} />
    </svg>
  </Icon>
)

export default Sprite
