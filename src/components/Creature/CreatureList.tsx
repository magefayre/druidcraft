import { List } from '@newhighsco/chipset'
import type { FC } from 'react'

import type { Creature } from '~types'

import { CreatureCard } from '.'
import styles from './CreatureList.module.scss'

type Props = {
  creatures?: Creature[]
  isCreatureDisabled?: (creature: Creature) => boolean
  isCreatureLimited?: (creature: Creature) => number
  speedLimits?: boolean
}

const CreatureList: FC<Props> = ({
  creatures,
  isCreatureDisabled,
  isCreatureLimited,
  speedLimits
}) => {
  if (!creatures?.length) return null

  return (
    <>
      <List unstyled className={styles.root}>
        {creatures.map((creature, index) => {
          const { name, source } = creature

          return (
            <li key={`${source}/${name}`}>
              <CreatureCard
                {...creature}
                disabled={isCreatureDisabled?.(creature)}
                limit={isCreatureLimited?.(creature)}
                priority={index < 12}
                speedLimits={speedLimits}
              />
            </li>
          )
        })}
      </List>
    </>
  )
}

export default CreatureList
