import { DiceRoller, type RollBase } from 'dice-roller-parser'
import type { Dispatch, SetStateAction } from 'react'
import { useSessionStorage } from 'usehooks-ts'

const roller = new DiceRoller()

export const useDiceTray = <T extends RollBase>(): [
  rolls: T[],
  saveRoll: Dispatch<SetStateAction<string>>,
  clearTray: () => void
] => {
  const [rolls, setRolls, clearTray] = useSessionStorage<T[]>('diceTray', [], {
    initializeWithValue: false
  })

  const saveRoll = (formula: string) => {
    const input = roller.parse(formula)

    const roll = roller.rollParsed(input) as T

    setRolls(rolls => [roll, ...rolls.slice(0, 9)])
  }

  return [rolls, saveRoll, clearTray]
}
