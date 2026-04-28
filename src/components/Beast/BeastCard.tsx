import { Card, Icon, Tooltip } from '@newhighsco/chipset'
import type { FC, SVGProps } from 'react'

import { LEVELS, SPEED_VERBS } from '~constants'
import sources from '~data/sources.json' with { type: 'json' }
import { ReactComponent as FlySvg } from '~images/fly.svg'
import { ReactComponent as SwimSvg } from '~images/swim.svg'
import type { Beast, Speed } from '~types'
import { formatCR, formatLevel } from '~utils'

import { TOKEN_SIZE, tokenURL } from '.'
import styles from './BeastCard.module.scss'

const ICONS: Partial<Record<Speed, FC<SVGProps<SVGSVGElement>>>> = {
  swim: SwimSvg,
  fly: FlySvg
}

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
        {Object.entries(ICONS).map(([type, Svg]) => {
          if (!speed[type]) return null

          return (
            <Tooltip
              key={type}
              toggle={
                <Icon alt={SPEED_VERBS[type]} className={styles.icon}>
                  <Svg />
                </Icon>
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
