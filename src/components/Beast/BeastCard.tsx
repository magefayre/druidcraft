import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import type { FC } from 'react'

import { LEVELS, SPEEDS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import type { Beast } from '~types'
import { formatCR, formatLevel } from '~utils'

import { TOKEN_SIZE, tokenURL, url } from '.'
import styles from './BeastCard.module.scss'

type Props = Beast & { disabled?: boolean }

const BeastCard: FC<Props> = ({ cr, name, source, speed, ...props }) => {
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
      href={url({ source, name })}
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
        {Object.keys(SPEEDS).map(type => {
          if (!speed[type]) return null

          const { plural } = SPEEDS[type]

          return (
            <Tooltip
              key={type}
              toggle={
                <Icon alt={plural} className={styles.icon}>
                  <svg viewBox="0 0 95 82.3" role="img">
                    <use xlinkHref={`#${type}`} />
                  </svg>
                </Icon>
              }
              manual={false}
            >
              {plural}: Requires {formatLevel(LEVELS[type])} level
            </Tooltip>
          )
        })}
      </span>
    </Card>
  )
}

export default BeastCard
