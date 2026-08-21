import type { FC } from 'react'

import Section from '~components/Section'
import { formatAligment, formatSize, formatType } from '~utils/5etools'

import type { CreatureDetailsProps } from './types'

const CreatureDetails: FC<CreatureDetailsProps> = ({
  ac,
  alignment,
  hp,
  name,
  size,
  speed,
  type
}) => {
  return (
    <Section>
      <h1>{name}</h1>
      <p>
        {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
      </p>
      <p>Armor Class {JSON.stringify(ac)}</p>
      <p>Hit Points {JSON.stringify(hp)}</p>
      <p>Speed {JSON.stringify(speed)}</p>
    </Section>
  )
}

export default CreatureDetails
