import type { FC } from 'react'

import Section from '~components/Section'
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

const CreatureDetails: FC<CreatureDetailsProps> = ({
  ability,
  ac,
  action,
  alignment,
  cr,
  hp,
  languages,
  name,
  senses,
  size,
  skill,
  speed,
  trait,
  type
}) => {
  return (
    <Section>
      <h1>{name}</h1>
      <p>
        {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
      </p>
      <p>Armor Class: {formatAC(ac)}</p>
      <p>Hit Points: {formatHP(hp)}</p>
      <p>Speed: {JSON.stringify(speed)}</p>
      <hr />
      {Object.entries(ability).map(([ability, value]) => (
        <p key={ability}>
          {ability.toUpperCase()}: {value} ({formatModifier(getModifier(value))}
          )
        </p>
      ))}
      <hr />
      <p>
        Skills:{' '}
        {Object.entries(skill).map(([skill, value]) => (
          <span key={skill}>
            {skill} {formatModifier(value)},{' '}
          </span>
        ))}
      </p>
      <p>
        Senses: {JSON.stringify(senses)} Passive Perception{' '}
        {getPassivePerception(ability.wis, skill.perception)}
      </p>
      <p>Languages: {JSON.stringify(languages)}</p>
      <p>Challenge: {formatCR(cr)}</p>
      {cr && <p>Proficiency Bonus: {formatPB(cr)}</p>}
      {trait && (
        <>
          <hr />
          <h2>Traits</h2>
          <p>{JSON.stringify(trait)}</p>
        </>
      )}
      {action && (
        <>
          <hr />
          <h2>Actions</h2>
          <p>{JSON.stringify(action)}</p>
        </>
      )}
    </Section>
  )
}

export default CreatureDetails
