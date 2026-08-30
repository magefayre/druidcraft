import { Card } from '@newhighsco/chipset'
import type { FC } from 'react'
import { titleCase } from 'title-case'

import AbilityList from '~components/AbilityList'
import ActionList from '~components/ActionList'
import DefinitionList, { Definition } from '~components/DefinitionList'
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
  getPassivePerception
} from '~utils/5etools'

import { IMAGE_SIZE } from './constants'
import styles from './CreatureDetails.module.scss'
import type { CreatureDetailsProps } from './types'
import { tokenURL } from './utils'

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
          [titleCase(key), formatModifier(modifiers[key])].join(' ')
        )
      )}
    </Definition>
  )
}

const CreatureDetails: FC<CreatureDetailsProps> = ({
  ability,
  ac,
  action = [],
  alignment,
  bonus,
  condition,
  cr,
  hp,
  immune,
  languages,
  legendary,
  name,
  reaction,
  resist,
  save,
  senses = [],
  source,
  size,
  skill,
  speed,
  trait,
  type,
  vulnerable
}) => (
  <Section>
    <Card
      heading={
        <>
          <h1>{name}</h1>
          <p>
            {formatSize(size)} {formatType(type)}, {formatAligment(alignment)}
          </p>
        </>
      }
      image={{
        src: tokenURL({ source, name }),
        priority: true,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE
      }}
      theme={{
        root: styles.root,
        heading: styles.heading,
        content: styles.content,
        copy: styles.copy,
        image: styles.image
      }}
    >
      <div className={styles.column}>
        <DefinitionList>
          <Definition term="Armor Class">
            <Tags>{formatAC(ac)}</Tags>
          </Definition>
          <Definition term="Hit Points">{formatHP(hp)}</Definition>
          <Definition term="Speed">{formatSpeed(speed)}</Definition>
        </DefinitionList>
        <AbilityList abilities={ability} />
        <DefinitionList>
          <ModifierList term="Saving Throws" modifiers={save} />
          <ModifierList term="Skills" modifiers={skill} />
          {vulnerable && (
            <Definition term="Damage Vulnerabilities">
              {formatDamage(vulnerable)}
            </Definition>
          )}
          {resist && (
            <Definition term="Damage Resistances">
              {formatDamage(resist)}
            </Definition>
          )}
          {/* TODO: combine Immunities */}
          {immune && (
            <Definition term="Damage Immunities">
              {formatList(immune)}
            </Definition>
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
      </div>
      <div className={styles.column}>
        <ActionList heading="Traits" actions={trait} />
        <ActionList heading="Actions" actions={action} />
        <ActionList heading="Legendary Actions" actions={legendary} />
        <ActionList heading="Bonus Actions" actions={bonus} />
        <ActionList heading="Reactions" actions={reaction} />
      </div>
    </Card>
  </Section>
)

export default CreatureDetails
