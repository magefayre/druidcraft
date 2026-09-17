import { Icon } from '@newhighsco/chipset'
import type { RollBase } from 'dice-roller-parser'
import type { FC } from 'react'

import styles from './Die.module.scss'

type Props = { count: RollBase; die: RollBase }

const Die: FC<Props> = ({ count, die }) => {
  return (
    <div className={styles.root} aria-hidden>
      {count.value}
      <Icon name={`mdi:dice-d${die.value}`} />
    </div>
  )
}

export default Die
