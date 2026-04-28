import { List } from '@newhighsco/chipset'
import type { FC } from 'react'

import type { Beast } from '~types'
import { getSpeedLimit } from '~utils'

import { BeastCard } from '.'
import styles from './BeastList.module.scss'

type Props = { beasts?: Beast[]; level?: number; maxCR?: number }

const BeastList: FC<Props> = ({ beasts, level, maxCR }) => {
  if (!beasts.length) return null

  return (
    <List unstyled className={styles.root}>
      {beasts.map(beast => {
        const { cr, name, source, speed } = beast
        const disabled =
          !maxCR ||
          cr > maxCR ||
          getSpeedLimit(level, speed, 'swim') ||
          getSpeedLimit(level, speed, 'fly')

        return (
          <li key={`${source}/${name}`}>
            <BeastCard {...beast} disabled={disabled} />
          </li>
        )
      })}
    </List>
  )
}

export default BeastList
