import { List } from '@newhighsco/chipset'
import type { FC } from 'react'

import type { Creature } from '~types'
import { getSpeedLimit } from '~utils/creatures'

import { CreatureCard } from '.'
import styles from './CreatureList.module.scss'

type Props = { creatures?: Creature[]; level?: number; maxCR?: number }

const CreatureList: FC<Props> = ({ creatures, level, maxCR }) => {
  if (!creatures.length) return null

  return (
    <>
      <List unstyled className={styles.root}>
        {creatures.map((creature, index) => {
          const { cr, name, source, speed } = creature
          const disabled =
            !maxCR ||
            cr > maxCR ||
            getSpeedLimit(level, speed, 'swim') ||
            getSpeedLimit(level, speed, 'fly')

          return (
            <li key={`${source}/${name}`}>
              <CreatureCard
                {...creature}
                disabled={disabled}
                priority={index < 12}
              />
            </li>
          )
        })}
      </List>
    </>
  )
}

export default CreatureList
