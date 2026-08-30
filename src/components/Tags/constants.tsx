import type { ReactNode } from 'react'
import { titleCase } from 'title-case'

import { ActionLabel } from '~components/ActionList'
import DiceRoller from '~components/DiceRoller'
import type { Skill } from '~types'
import { formatModifier, formatRecharge } from '~utils/5etools'

import type { Attack, Tag } from './types'

const diceRoller = (formula: string) => <DiceRoller>{formula}</DiceRoller>

const ATTACKS = {
  ms: 'Melee Spell',
  mw: 'Melee Weapon',
  rs: 'Ranged Spell',
  rw: 'Ranged Weapon',
  'ms,rs': 'Melee or Ranged Spell',
  'mw,rw': 'Melee or Ranged Weapon'
} satisfies Readonly<Record<Attack, string>>

export const TAGS = {
  action: action => action,
  atk: (attack: Attack) => <ActionLabel>{ATTACKS[attack]} Attack</ActionLabel>,
  book: label => label,
  condition: condition => condition,
  creature: creature => creature,
  damage: diceRoller,
  dc: save => `DC ${save}`,
  dice: diceRoller,
  filter: label => label,
  frequency: label => {
    const { groups: { times, each } = {} } =
      label.match(/(?<times>\d+)(?<each>e)?/) ?? {}

    return (
      <ActionLabel subheading>
        {times
          ? [`${times}/day`, each && 'each'].filter(Boolean).join(' ')
          : label}
      </ActionLabel>
    )
  },
  h: () => <ActionLabel>Hit</ActionLabel>,
  hit: args => {
    const modifier = parseInt(args)

    return (
      <DiceRoller dice="1d20" bonus={modifier}>
        {formatModifier(modifier)}
      </DiceRoller>
    )
  },
  hom: () => <ActionLabel>Hit or Miss</ActionLabel>,
  item: (name, _, label) => label ?? name,
  m: () => <ActionLabel>Miss</ActionLabel>,
  recharge: value => (
    <>
      (Recharge{' '}
      <DiceRoller dice="1d6">
        {formatRecharge(!!value ? parseInt(value) : undefined)}
      </DiceRoller>
      )
    </>
  ),
  sense: sense => sense,
  skill: (skill: Skill) => skill,
  spell: spell => titleCase(spell),
  status: status => status,
  table: label => label
} satisfies Readonly<Record<Tag, (...args: string[]) => ReactNode>>
