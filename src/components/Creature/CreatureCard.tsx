import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import plur from 'plur'
import type { FC } from 'react'

import Rating from '~components/Rating'
import { EMPTY, SPEEDS } from '~constants'
import SOURCES from '~data/sources.json' with { type: 'json' }
import sprite from '~images/sprite.svg'
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
        <>
          <h2>
            <Rating {...tooltipHeading}>{rating}</Rating>
            {name}
          </h2>
          <Tooltip
            toggle={<span className={styles.source}>{source}</span>}
            {...tooltipHeading}
          >
            {SOURCES[source]}
          </Tooltip>
        </>
      }
      image={{
        src: tokenURL({ source, name }),
        priority,
        width: TOKEN_SIZE,
        height: TOKEN_SIZE,
        sizes: '64px'
      }}
      href={!disabled ? url({ source, name }) : undefined}
      aria-disabled={disabled ? true : undefined}
      theme={{
        root: styles.root,
        content: styles.content,
        copy: styles.copy,
        heading: styles.heading,
        image: styles.image
      }}
      {...props}
    >
      {limit && (
        <Tooltip
          toggle={<span className={styles.icon}>{limit}×</span>}
          {...tooltipContent}
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
                <Icon className={styles.icon}>
                  <svg>
                    <use xlinkHref={`${sprite}#${type}`} />
                  </svg>
                </Icon>
              }
              {...tooltipContent}
            >
              <span aria-hidden>{singular}</span>
            </Tooltip>
          )
        })}
      {crLabel !== EMPTY && (
        <Tooltip
          toggle={<span>CR {crLabel}</span>}
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
