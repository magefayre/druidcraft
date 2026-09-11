import { Button } from '@newhighsco/chipset'
import type { FC, MouseEventHandler, PropsWithChildren } from 'react'

import styles from './DiceRoller.module.scss'

type Props = PropsWithChildren<{ dice?: string; bonus?: string }>

const DiceRoller: FC<Props> = ({ dice, bonus, children }) => {
  const handleRoll: MouseEventHandler<HTMLButtonElement> = () => {
    console.log(111, dice ? [dice, bonus].filter(Boolean).join('') : children)
  }

  return (
    <Button onClick={handleRoll} className={styles.root}>
      {children}
    </Button>
  )
}

export default DiceRoller
