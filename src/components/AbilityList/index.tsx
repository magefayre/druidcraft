import type { FC } from 'react'

import DefinitionList, { Definition } from '~components/DefinitionList'
import { DiceRoller } from '~components/Dice'
import type { Abilities } from '~types'
import { formatModifier, getModifier } from '~utils/5etools'

import styles from './AbilityList.module.scss'

type Props = { abilities?: Abilities }

const AbilityList: FC<Props> = ({ abilities }) => {
  if (!abilities) return null

  return (
    <DefinitionList className={styles.root}>
      {Object.entries(abilities).map(([ability, value]) => {
        const modifier = formatModifier(getModifier(value))
        const term = ability.toUpperCase()

        return (
          <Definition key={ability} term={term}>
            <DiceRoller dice="1d20" modifier={modifier} label={term}>
              {value} ({modifier})
            </DiceRoller>
          </Definition>
        )
      })}
    </DefinitionList>
  )
}

export default AbilityList
