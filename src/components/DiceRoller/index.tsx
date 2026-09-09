import { Button } from '@newhighsco/chipset'
import type { FC, MouseEventHandler, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{ dice?: string; bonus?: number }>

const DiceRoller: FC<Props> = ({ dice, bonus, children }) => {
  const handleRoll: MouseEventHandler<HTMLButtonElement> = () => {
    console.log(111, dice, bonus, children)
  }

  return <Button onClick={handleRoll}>{children}</Button>
}

export default DiceRoller
