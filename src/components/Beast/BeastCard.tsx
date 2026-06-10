import { Card, Tooltip } from '@newhighsco/chipset'
import type { FC } from 'react'

import Icon from '~components/Icon/Icon'
import { LEVELS, SPEEDS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import type { Beast } from '~types'
import { formatCR, formatLevel } from '~utils'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './BeastCard.module.scss'

type Props = Beast & { disabled?: boolean }

const BeastCard: FC<Props> = ({
  cr,
  disabled,
  name,
  source,
  speed,
  ...props
}) => {
  const crLabel = formatCR(cr)

  return (
    <Card
      heading={
        <>
          <h2>{name}</h2>
          <Tooltip
            valign="bottom"
            toggle={<span className={styles.source}>{source}</span>}
            manual={false}
          >
            {sources[source]}
          </Tooltip>
        </>
      }
      image={{
        src: tokenURL({ source, name }),
        width: TOKEN_SIZE,
        height: TOKEN_SIZE
      }}
      href={!disabled ? url({ source, name }) : undefined}
      disabled={disabled}
      {...props}
    >
      <Tooltip
        toggle={<span>CR {crLabel}</span>}
        theme={{ root: styles.cr, toggle: styles.crToggle }}
        manual={false}
      >
        Challenge Rating {crLabel}
      </Tooltip>
      <span className={styles.icons}>
        {Object.entries(SPEEDS).map(([type, { singular }]) => {
          if (!LEVELS[type] || !speed[type]) return null

          return (
            <Tooltip
              key={type}
              toggle={
                <Icon name={type} alt={singular} className={styles.icon} />
              }
              manual={false}
            >
              {singular}: Requires {formatLevel(LEVELS[type])} level
            </Tooltip>
          )
        })}
      </span>
    </Card>
  )
}

export default BeastCard
