import type { FC } from 'react'

import { CreatureList } from '~components/Creature'
import Section from '~components/Section'
import { EMPTY } from '~constants'
import type { Creature } from '~types'

export type SummonProps = { beasts: Creature[] }

const Summon: FC<SummonProps> = () => {
  const creatures = []

  return (
    <>
      <Section>
        <form>
          <label>Spell</label>
          <select>
            <option value="">{EMPTY}</option>
            <option>Summon Beast</option>
            <option>Conjure Animals</option>
            <option>Summon Fey</option>
            <option>Conjure Minor Elementals</option>
            <option>Conjure Woodland Beings</option>
            <option>Giant Insect</option>
            <option>Summon Elemental</option>
            <option>Conjure Elemental</option>
            <option>Summon Draconic Spirit</option>
            <option>Conjure Fey</option>
          </select>
        </form>
      </Section>
      <Section>
        <CreatureList creatures={creatures} />
      </Section>
    </>
  )
}

export default Summon
