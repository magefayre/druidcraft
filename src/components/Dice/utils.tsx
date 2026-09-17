import type {
  DiceRollResult,
  ExpressionRoll,
  RollBase,
  RollType
} from 'dice-roller-parser'
import type { ReactNode } from 'react'

import Die from './Die'

const RENDERERS = {
  die: ({ value, ...rest }: DiceRollResult) => (
    <>
      <Die {...rest} /> {value}
    </>
  ),
  expressionroll: (roll: ExpressionRoll) => {
    const output = []

    if (!!roll.dice.length) {
      roll.dice.forEach((dice, index) => {
        output.push(renderRoll(dice), roll.ops[index])
      })
    }

    output.push('=', roll.value)

    return output as ReactNode
  },
  number: ({ value }) => value
} as Readonly<Record<RollType, (roll: RollBase) => ReactNode>>

export const renderRoll = (roll: RollBase) => {
  return RENDERERS[roll.type]?.(roll) ?? JSON.stringify(roll, null, 2)
}
