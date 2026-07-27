import { classNames, Icon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

import styles from './Sprite.module.scss'
import { ReactComponent as SpriteSvg } from './sprite.svg'

type Props = PropTypes.InferProps<Icon.propTypes>

const Sprite: FC<Props> = ({ id, className, ...rest }) => (
  <Icon className={classNames(styles.root, className)} {...rest}>
    <svg>
      <use href={`#${id}`} />
    </svg>
  </Icon>
)

const Sprites = () => <SpriteSvg aria-hidden className={styles.sheet} />

export { Sprites }
export default Sprite
