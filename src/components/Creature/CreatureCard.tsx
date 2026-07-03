import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import plur from 'plur'
import type { FC } from 'react'

import { EMPTY, LEVELS, SPEEDS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import { formatCR, formatLevel } from '~utils/5etools'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './CreatureCard.module.scss'
import type { CreatureCardProps } from './types'

const tooltipProps = { manual: false, align: 'left', valign: 'middle' }

const BeastCard: FC<CreatureCardProps> = ({
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
            align="center"
            valign="bottom"
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
      theme={{
        root: styles.root,
        content: styles.content,
        copy: styles.copy,
        image: styles.image
      }}
      {...props}
    >
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
      {crLabel !== EMPTY && (
        <Tooltip
          toggle={<span>CR {crLabel}</span>}
          theme={{ toggle: styles.cr }}
          {...tooltipProps}
        >
          Challenge Rating&nbsp;{crLabel}
        </Tooltip>
      )}
    </Card>
  )
}

export default BeastCard
