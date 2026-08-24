import { Fragment, type ReactNode } from 'react'

import DiceRoller from '~components/DiceRoller'
import type { Skill } from '~types'
import { formatModifier, formatRecharge } from '~utils/5etools'

import { ActionLabel } from '.'

type Tag =
  | 'action'
  | 'atk'
  | 'book'
  | 'condition'
  | 'creature'
  | 'damage'
  | 'dc'
  | 'dice'
  | 'filter'
  | 'h'
  | 'hit'
  | 'hom'
  | 'm'
  | 'recharge'
  | 'sense'
  | 'skill'
  | 'spell'
  | 'status'
  | 'table'
type Attack = 'ms' | 'mw' | 'rs' | 'rw' | 'ms,rs' | 'mw,rw'

const ATTACKS = {
  ms: 'Melee Spell',
  mw: 'Melee Weapon',
  rs: 'Ranged Spell',
  rw: 'Ranged Wweapon',
  'ms,rs': 'Melee or Ranged Spell',
  'mw,rw': 'Melee or Ranged Weapon'
} satisfies Readonly<Record<Attack, string>>

const diceRoller = (formula: string) => <DiceRoller>{formula}</DiceRoller>

const parseArgs = (args: string) => args.split('|')

const TAGS = {
  action: action => action,
  atk: (attack: Attack) => <ActionLabel>{ATTACKS[attack]} Attack</ActionLabel>,
  book: args => {
    // TODO: Handle args `text|source|pg|term`
    const [label] = parseArgs(args)

    return label
  },
  condition: condition => condition,
  creature: args => {
    // TODO: Handle args `creature|source`
    const [creature] = parseArgs(args)

    return creature
  },
  damage: diceRoller,
  dc: save => `DC ${save}`,
  dice: diceRoller,
  filter: args => {
    // TODO: Handle args `text|rewards|type=?`
    const [label] = parseArgs(args)

    return label
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
  spell: spell => spell,
  status: status => status,
  table: args => {
    // TODO: Handle args `text|source`
    const [label] = parseArgs(args)

    return label
  }
} satisfies Readonly<Record<Tag, (args?: string) => ReactNode>>

export const parseTags = (action: string) =>
  action.split(/{|}/).map((match, index) => {
    const { groups: { tag, args } = {} } =
      match.match(/@(?<tag>\w+)(\s(?<args>.+))?/) ?? {}

    return <Fragment key={index}>{TAGS[tag]?.(args) ?? match}</Fragment>
  })
