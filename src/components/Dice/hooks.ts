import { DiceRoller, type RollBase } from 'dice-roller-parser'
import type { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const MAX = 10
const roller = new DiceRoller()

export const useDiceTray = <T extends RollBase>(): [
  rolls: T[],
  saveRoll: Dispatch<SetStateAction<string>>,
  clearTray: () => void
] => {
  const [rolls, setRolls, clearTray] = useLocalStorage<T[]>('diceTray', [], {
    initializeWithValue: false
  })

  const saveRoll = (formula: string) => {
    const input = roller.parse(formula)
    const roll = roller.rollParsed(input) as T

    setRolls(rolls => [roll, ...rolls.slice(0, MAX - 1)])
  }

  return [rolls, saveRoll, clearTray]
}
