import { Button } from '@newhighsco/chipset'
import type { FC, PropsWithChildren } from 'react'

import type { Dice } from '~types'

import styles from './DiceRoller.module.scss'
import { useDiceTray } from './hooks'

type PropsBase = PropsWithChildren<{ label?: string }>
type PropsWithDice = {
  dice: `${number}d${Dice}`
  modifier?: string
  formula?: never
}
type PropsWithFormula = { formula: string; dice?: never; modifier?: never }
export type DiceRollerProps = PropsBase & (PropsWithDice | PropsWithFormula)

const DiceRoller: FC<DiceRollerProps> = ({
  dice,
  modifier,
  label,
  formula = [dice, modifier].filter(Boolean).join(''),
  children = formula
}) => {
  const [, saveRoll] = useDiceTray()

  const handleRoll = () => {
    saveRoll([formula, label].filter(Boolean).join(' '))
  }

  return (
    <Button onClick={handleRoll} className={styles.root}>
      {children}
    </Button>
  )
}

export default DiceRoller
