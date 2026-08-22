import { List } from '@newhighsco/chipset'
import type { FC } from 'react'
import titleize from 'titleize'

import Section from '~components/Section'
import type { Action } from '~types'
import {
  formatAC,
  formatAligment,
  formatCR,
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

const ActionList = ({
  heading,
  actions
}: {
  heading: string
  actions?: Action[]
}) => {
  if (!actions?.length) return null

  return (
    <div className={styles.actions}>
      <h2>{heading}</h2>
      <List unstyled>
        {actions.map(({ name, entries }) => (
          <li key={name}>
            <strong>
              <em>{name}.</em>
            </strong>{' '}
            {entries.join('. ')}
          </li>
        ))}
      </List>
    </div>
  )
}

const DefinitionList = props => (
  <List as="dl" className={styles.list} {...props} />
)

const Definition = ({ label, children, visible = true }) => {
  if (!visible) return null

  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
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
    <Definition label={label}>
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
  senses,
  size,
  skill,
  speed,
  trait,
  type
}) => (
  <Section className={styles.root}>
    <h1>{name}</h1>
    <p>
      <em>
        {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
      </em>
    </p>
    <DefinitionList>
      <Definition label="Armor Class">{formatAC(ac)}</Definition>
      <Definition label="Hit Points">{formatHP(hp)}</Definition>
      <Definition label="Speed">{formatSpeed(speed)}</Definition>
    </DefinitionList>
    <DefinitionList>
      {Object.entries(ability).map(([ability, value]) => (
        <Definition key={ability} label={ability.toUpperCase()}>
          {value} ({formatModifier(getModifier(value))})
        </Definition>
      ))}
    </DefinitionList>
    <DefinitionList>
      <ModifierList label="Saving Throws" modifiers={save} />
      <ModifierList label="Skills" modifiers={skill} />
      <Definition label="Damage Resistances" visible={!!resist}>
        {formatList(resist)}
      </Definition>
      <Definition label="Damage Immunities" visible={!!immune}>
        {formatList(immune)}
      </Definition>
      <Definition label="Condition Immunities" visible={!!condition}>
        {formatList(condition)}
      </Definition>
      <Definition label="Senses">
        {formatList([
          ...senses,
          `passive Perception ${getPassivePerception(ability.wis, skill?.perception)}`
        ])}
      </Definition>
      <Definition label="Languages">{formatList(languages)}</Definition>
      <Definition label="Challenge">
        {formatCR(cr)} {cr !== undefined && <>(PB {formatPB(cr)})</>}
      </Definition>
    </DefinitionList>
    <ActionList heading="Traits" actions={trait} />
    <ActionList heading="Actions" actions={action} />
    <ActionList heading="Bonus Actions" actions={bonus} />
  </Section>
)

export default CreatureDetails
