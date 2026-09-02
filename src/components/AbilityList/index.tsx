import type { FC } from 'react'

import DefinitionList, { Definition } from '~components/DefinitionList'
import DiceRoller from '~components/DiceRoller'
import type { Abilities } from '~types'
import { formatModifier, getModifier } from '~utils/5etools'

import styles from './AbilityList.module.scss'

type Props = { abilities?: Abilities }

const AbilityList: FC<Props> = ({ abilities }) => {
  if (!abilities) return null

  return (
    <DefinitionList className={styles.root}>
      {Object.entries(abilities).map(([ability, value]) => {
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
  )
}

export default AbilityList
