import { Prose } from '@newhighsco/chipset'
import type { FC } from 'react'

import { formatAligment, formatSize, formatType } from '~utils/5etools'

import type { CreatureDetailsProps } from './types'

const CreatureDetails: FC<CreatureDetailsProps> = ({
  alignment,
  name,
  size,
  type
}) => {
  return (
    <Prose>
      <h1>{name}</h1>
      <p>
        {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
      </p>
    </Prose>
  )
}

export default CreatureDetails
