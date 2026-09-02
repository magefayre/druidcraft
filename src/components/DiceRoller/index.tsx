import type { FC, MouseEventHandler, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{ dice?: string; bonus?: number }>

const DiceRoller: FC<Props> = ({ dice, bonus, children }) => {
  const handleRoll: MouseEventHandler<HTMLButtonElement> = () => {
    console.log(111, dice, bonus, children)
  }

  return <button onClick={handleRoll}>{children}</button>
}

export default DiceRoller
