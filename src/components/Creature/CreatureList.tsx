import { classNames, List } from '@newhighsco/chipset'
import type { FC } from 'react'

import { CreatureCard } from '.'
import styles from './CreatureList.module.scss'
import type { CreatureListProps } from './types'

const CreatureList: FC<CreatureListProps> = ({
  creatures,
  isCreatureDisabled,
  isCreatureLimited,
  speedLimits,
  view = 'grid'
}) => {
  if (!creatures?.length) return null

  return (
    <>
      <List unstyled className={classNames(styles.root, styles[view])}>
        {creatures.map((creature, index) => {
          const { name, source } = creature

          return (
            <li key={`${source}/${name}`} className={styles.item}>
              <CreatureCard
                {...creature}
                disabled={isCreatureDisabled?.(creature)}
                limit={isCreatureLimited?.(creature)}
                priority={index < 12}
                speedLimits={speedLimits}
                view={view}
              />
            </li>
          )
        })}
      </List>
    </>
  )
}

export default CreatureList
