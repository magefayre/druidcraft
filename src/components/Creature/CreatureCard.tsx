import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import plur from 'plur'
import type { FC } from 'react'

import { EMPTY, LEVELS, SPEEDS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import type { Creature } from '~types'
import { formatCR, formatLevel } from '~utils/5etools'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './CreatureCard.module.scss'

const tooltipProps = { manual: false, valign: 'bottom' }

type Props = Creature & {
  disabled?: boolean
  limit?: number
  priority?: boolean
  speedLimits?: boolean
}

const BeastCard: FC<Props> = ({
  cr,
  disabled,
  limit,
  name,
  priority,
  source,
  speed,
  speedLimits,
  ...props
}) => {
  const crLabel = formatCR(cr)

  return (
    <Card
      heading={
        <>
          <h2>{name}</h2>
          <Tooltip
            toggle={<span className={styles.source}>{source}</span>}
            {...tooltipProps}
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
      {...props}
    >
      {crLabel !== EMPTY && (
        <Tooltip
          toggle={<span>CR {crLabel}</span>}
          theme={{ root: styles.cr, toggle: styles.crToggle }}
          {...tooltipProps}
        >
          Challenge Rating&nbsp;{crLabel}
        </Tooltip>
      )}
      <span className={styles.icons}>
        {limit && (
          <Tooltip
            toggle={<span className={styles.icon}>{limit}×</span>}
            {...tooltipProps}
          >
            Summon&nbsp;{limit} {plur(name, limit)}
          </Tooltip>
        )}
        {speedLimits &&
          Object.entries(SPEEDS).map(([type, { icon, singular }]) => {
            if (!icon || !speed[type]) return null

            return (
              <Tooltip
                key={type}
                toggle={
                  <Icon name={icon} alt={singular} className={styles.icon} />
                }
                {...tooltipProps}
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
