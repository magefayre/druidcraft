import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import type { FC } from 'react'

import { EMPTY, LEVELS, SPEEDS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import type { Creature } from '~types'
import { formatCR, formatLevel } from '~utils/creatures'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './CreatureCard.module.scss'

type Props = Creature & { disabled?: boolean; priority?: boolean }

const BeastCard: FC<Props> = ({
  cr,
  disabled,
  name,
  priority,
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
        priority,
        width: TOKEN_SIZE,
        height: TOKEN_SIZE
      }}
      href={!disabled ? url({ source, name }) : undefined}
      disabled={disabled}
      className={styles.root}
      {...props}
    >
      {crLabel !== EMPTY && (
        <Tooltip
          valign="bottom"
          toggle={<span>CR {crLabel}</span>}
          theme={{ root: styles.cr, toggle: styles.crToggle }}
          manual={false}
        >
          Challenge Rating {crLabel}
        </Tooltip>
      )}
      <span className={styles.icons}>
        {Object.entries(SPEEDS).map(([type, { icon, singular }]) => {
          if (!icon || !speed[type]) return null

          return (
            <Tooltip
              valign="bottom"
              key={type}
              toggle={
                <Icon name={icon} alt={singular} className={styles.icon} />
              }
              manual={false}
            >
              Requires {formatLevel(LEVELS[type])} level
            </Tooltip>
          )
        })}
      </span>
    </Card>
  )
}

export default BeastCard
