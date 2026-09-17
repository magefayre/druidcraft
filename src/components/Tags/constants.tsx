import type { ReactNode } from 'react'
import { titleCase } from 'title-case'

import { ActionLabel, ActionName } from '~components/ActionList'
import { DiceRoller } from '~components/Dice'
import type { Skill } from '~types'
import { formatModifier, formatRecharge } from '~utils/5etools'

import type { Attack, Tag } from './types'

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
  damage: (formula: string, label: string) => (
    <DiceRoller formula={formula} label={[label, '(damage'].join(' ')} />
  ),
  dc: save => `DC ${save}`,
  dice: (formula: string) => <DiceRoller formula={formula} />,
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
  hit: (value, label) => {
    const modifier = formatModifier(parseInt(value))

    return (
      <DiceRoller formula={['1d20', modifier, label, '(to hit)'].join(' ')}>
        {modifier}
      </DiceRoller>
    )
  },
  hom: () => <ActionLabel>Hit or Miss</ActionLabel>,
  item: (name, _, label) => label ?? name,
  m: () => <ActionLabel>Miss</ActionLabel>,
  recharge: value => (
    <>
      (Recharge{' '}
      <DiceRoller formula="1d6">
        {formatRecharge(!!value ? parseInt(value) : undefined)}
      </DiceRoller>
      )
    </>
  ),
  sense: sense => sense,
  skill: (skill: Skill) => skill,
  spell: spell => titleCase(spell),
  status: status => status,
  subheading: label => <ActionName subheading>{label}</ActionName>,
  table: label => label
} satisfies Readonly<Record<Tag, (...args: string[]) => ReactNode>>
