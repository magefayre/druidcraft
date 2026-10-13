import type { RollBase } from 'dice-roller-parser'
import type { FC } from 'react'

import Sprite from '~components/Sprite'

import { ReactComponent as DiceSvg } from './dice.svg'
import styles from './Die.module.scss'

type Props = { count: RollBase; die: RollBase }

const Die: FC<Props> = ({ count, die }) => {
  const id = `d${die.value}`

  return (
    <div className={styles.root} aria-hidden>
      {count.value}
      <Sprite id={id} className={styles.icon} />
    </div>
  )
}

const Dice = () => <DiceSvg aria-hidden className={styles.sheet} />

export { Dice }
export default Die
