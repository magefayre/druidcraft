import { Icon as ThemedIcon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC } from 'react'

type Props = PropTypes.InferProps<ThemedIcon.propTypes>

const Icon: FC<Props> = ({ name, width = 95, height = 82.3, ...props }) => (
  <ThemedIcon {...props}>
    <svg viewBox={`0 0 ${width} ${height}`}>
      <use xlinkHref={`#${name}`} />
    </svg>
  </ThemedIcon>
)

export default Icon
