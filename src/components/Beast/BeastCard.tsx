import { Card } from '@newhighsco/chipset'
import type { FC } from 'react'

import sources from '~data/sources.json' with { type: 'json' }
import type { Beast } from '~types'
import { formatCR, formatSpeed } from '~utils'

import { TOKEN_SIZE, tokenURL } from '.'

type Props = Beast & { disabled?: boolean }

const BeastCard: FC<Props> = ({ cr, name, source, speed, ...props }) => {
  return (
    <Card
      heading={<h2>{name}</h2>}
      image={{
        src: tokenURL({ source, name }),
        width: TOKEN_SIZE,
        height: TOKEN_SIZE
      }}
      {...props}
    >
      <abbr title="Challenge Rating">CR {formatCR(cr)}</abbr>
      <abbr title={sources[source]}>{source}</abbr>
      {formatSpeed(speed, 'swim')}
      {formatSpeed(speed, 'fly')}
    </Card>
  )
}

export default BeastCard
