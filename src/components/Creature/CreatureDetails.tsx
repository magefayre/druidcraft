import type { FC } from 'react'
import titleize from 'titleize'

import Section from '~components/Section'
import type { Action } from '~types'
import {
  formatAC,
  formatAligment,
  formatCR,
  formatHP,
  formatModifier,
  formatPB,
  formatSize,
  formatType,
  getModifier,
  getPassivePerception
} from '~utils/5etools'

import type { CreatureDetailsProps } from './types'

const ActionList = ({
  heading,
  actions
}: {
  heading: string
  actions?: Action[]
}) => {
  if (!actions?.length) return null

  return (
    <>
      <hr />
      <h2>{heading}</h2>
      <p>{JSON.stringify(actions)}</p>
    </>
  )
}

const ModifierList = <T extends string>({
  label,
  modifiers
}: {
  label: string
  modifiers?: Partial<Record<T, number>>
}) => {
  if (!modifiers) return null

  return (
    <p>
      {label}:{' '}
      {Object.keys(modifiers).map(key => (
        <span key={key}>
          {titleize(key)} {formatModifier(modifiers[key])},{' '}
        </span>
      ))}
    </p>
  )
}

const CreatureDetails: FC<CreatureDetailsProps> = ({
  ability,
  ac,
  action,
  alignment,
  bonus,
  condition,
  cr,
  hp,
  immune,
  languages,
  name,
  resist,
  save,
  senses,
  size,
  skill,
  speed,
  trait,
  type
}) => (
  <Section>
    <h1>{name}</h1>
    <p>
      {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
    </p>
    <hr />
    <p>Armor Class: {formatAC(ac)}</p>
    <p>Hit Points: {formatHP(hp)}</p>
    <p>Speed: {JSON.stringify(speed)}</p>
    <hr />
    {Object.entries(ability).map(([ability, value]) => (
      <p key={ability}>
        {ability.toUpperCase()}: {value} ({formatModifier(getModifier(value))})
      </p>
    ))}
    <hr />
    <ModifierList label="Saving Throws" modifiers={save} />
    <ModifierList label="Skills" modifiers={skill} />
    {resist && <p>Damage Resistances: {JSON.stringify(resist)}</p>}
    {immune && <p>Damage Immunities: {JSON.stringify(immune)}</p>}
    {condition && <p>Condition Immunities: {JSON.stringify(condition)}</p>}
    <p>
      Senses: {JSON.stringify(senses)} Passive Perception{' '}
      {getPassivePerception(ability.wis, skill?.perception)}
    </p>
    <p>Languages: {JSON.stringify(languages)}</p>
    <p>
      Challenge: {formatCR(cr)} {cr && <>(PB {formatPB(cr)})</>}
    </p>
    <ActionList heading="Traits" actions={trait} />
    <ActionList heading="Actions" actions={action} />
    <ActionList heading="Bonus Actions" actions={bonus} />
  </Section>
)

export default CreatureDetails
