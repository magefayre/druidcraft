import { Card, Tooltip } from '@newhighsco/chipset'
import plur from 'plur'
import type { FC } from 'react'

import Rating from '~components/Rating'
import Sprite from '~components/Sprite'
import { EMPTY, LEVELS, SPEEDS } from '~constants'
import SOURCES from '~data/sources.json' with { type: 'json' }
import { formatCR } from '~utils/5etools'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './CreatureCard.module.scss'
import type { CreatureCardProps } from './types'

const CreatureCard: FC<CreatureCardProps> = ({
  cr,
  disabled,
  limit,
  name,
  priority,
  rating,
  source,
  speed,
  speedLimits,
  ...props
}) => {
  const crLabel = formatCR(cr)
  const tooltipContent = {
    disabled,
    described: false,
    manual: disabled,
    align: 'left',
    valign: 'middle'
  }
  const tooltipHeading = {
    ...tooltipContent,
    align: 'center',
    valign: 'bottom'
  }

  return (
    <Card
      heading={
        <span className={styles.heading}>
          <h2>{name}</h2>
          <Tooltip
            toggle={source}
            theme={{ root: styles.source, toggle: styles.sourceToggle }}
            {...tooltipHeading}
          >
            {SOURCES[source]}
          </Tooltip>
          <Rating className={styles.rating} {...tooltipHeading}>
            {rating}
          </Rating>
        </span>
      }
      image={{
        src: tokenURL({ source, name }),
        priority,
        width: TOKEN_SIZE,
        height: TOKEN_SIZE
      }}
      href={!disabled ? url({ source, name }) : undefined}
      aria-disabled={disabled ? true : undefined}
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
          toggle={`${limit}×`}
          theme={{ toggle: styles.icon }}
          {...tooltipContent}
        >
          Summon&nbsp;{limit} {plur(name, limit)}
        </Tooltip>
      )}
      {speedLimits &&
        Object.entries(SPEEDS)
          .sort(([a], [b]) => LEVELS[a] - LEVELS[b])
          .map(([type, { icon, singular }]) => {
            if (!icon || !speed[type]) return null

            return (
              <Tooltip
                key={type}
                toggle={<Sprite id={type} className={styles.icon} />}
                {...tooltipContent}
              >
                {singular}
              </Tooltip>
            )
          })}
      {crLabel !== EMPTY && (
        <Tooltip
          toggle={`CR ${crLabel}`}
          theme={{ toggle: styles.cr }}
          {...tooltipContent}
        >
          Challenge Rating&nbsp;{crLabel}
        </Tooltip>
      )}
    </Card>
  )
}

export default CreatureCard
