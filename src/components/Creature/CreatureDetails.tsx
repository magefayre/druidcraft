import type { FC } from 'react'
import titleize from 'titleize'

import ActionList from '~components/ActionList'
import DefinitionList, { Definition } from '~components/DefinitionList'
import DiceRoller from '~components/DiceRoller'
import Section from '~components/Section'
import Tags from '~components/Tags'
import {
  formatAC,
  formatAligment,
  formatCR,
  formatDamage,
  formatHP,
  formatList,
  formatModifier,
  formatPB,
  formatSize,
  formatSpeed,
  formatType,
  getModifier,
  getPassivePerception
} from '~utils/5etools'

import styles from './CreatureDetails.module.scss'
import type { CreatureDetailsProps } from './types'

const ModifierList = <T extends string>({
  term,
  modifiers
}: {
  term: string
  modifiers?: Partial<Record<T, number>>
}) => {
  if (!modifiers) return null

  return (
    <Definition term={term}>
      {formatList(
        Object.keys(modifiers).map(key =>
          [titleize(key), formatModifier(modifiers[key])].join(' ')
        )
      )}
    </Definition>
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
  senses = [],
  size,
  skill,
  speed,
  trait,
  type
}) => (
  <Section>
    <h1>{name}</h1>
    <p>
      <em>
        {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
      </em>
    </p>
    <DefinitionList>
      <Definition term="Armor Class">
        <Tags>{formatAC(ac)}</Tags>
      </Definition>
      <Definition term="Hit Points">{formatHP(hp)}</Definition>
      <Definition term="Speed">{formatSpeed(speed)}</Definition>
    </DefinitionList>
    <DefinitionList className={styles.abilities}>
      {Object.entries(ability).map(([ability, value]) => {
        const modifier = getModifier(value)

        return (
          <Definition key={ability} term={ability.toUpperCase()}>
            <DiceRoller dice="1d20" bonus={modifier}>
              {value} ({formatModifier(modifier)})
            </DiceRoller>
          </Definition>
        )
      })}
    </DefinitionList>
    <DefinitionList>
      <ModifierList term="Saving Throws" modifiers={save} />
      <ModifierList term="Skills" modifiers={skill} />
      {resist && (
        <Definition term="Damage Resistances">
          {formatDamage(resist)}
        </Definition>
      )}
      {immune && (
        <Definition term="Damage Immunities">{formatList(immune)}</Definition>
      )}
      {condition && (
        <Definition term="Condition Immunities">
          {formatList(condition)}
        </Definition>
      )}
      <Definition term="Senses">
        {formatList([
          ...senses,
          `passive Perception ${getPassivePerception(ability.wis, skill?.perception)}`
        ])}
      </Definition>
      <Definition term="Languages">{formatList(languages)}</Definition>
      <Definition term="Challenge">
        {formatCR(cr)} {cr !== undefined && <>(PB {formatPB(cr)})</>}
      </Definition>
    </DefinitionList>
    <ActionList heading="Traits" actions={trait} />
    {/* TODO: add `spellcasting` to Actions */}
    <ActionList heading="Actions" actions={action} />
    <ActionList heading="Bonus Actions" actions={bonus} />
  </Section>
)

export default CreatureDetails
