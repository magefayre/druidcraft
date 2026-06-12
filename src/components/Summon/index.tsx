import type { ChangeEventHandler, FC } from 'react'

import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import { EMPTY } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import type { Creature } from '~types'

type FormData = { spell: string }

export type SummonProps = { beasts: Creature[]; feys: Creature[] }

const SPELLS: Record<
  string,
  { type: string; maxCR?: number; spell?: boolean }
> = {
  'Summon Beast': { spell: true, type: 'beasts' },
  'Conjure Animal': { maxCR: 2, type: 'beasts' },
  'Summon Fey': { spell: true, type: 'feys' },
  'Conjure Minor Elementals': { type: 'beasts' },
  'Conjure Woodland Being': { type: 'beasts' },
  'Giant Insect': { type: 'beasts' },
  'Summon Elemental': { type: 'beasts' },
  'Conjure Elemental': { type: 'beasts' },
  'Summon Draconic Spirit': { type: 'beasts' },
  'Conjure Fey': { type: 'beasts' }
}

const Summon: FC<SummonProps> = props => {
  const [formData, setFormData, mounted] = useLocalStorage<FormData>('summon', {
    spell: undefined
  })
  const { spell } = formData
  const filters = SPELLS[spell]

  const handleChange: ChangeEventHandler<HTMLFormElement> = ({ target }) => {
    const { name, value } = target

    setFormData(formData => ({ ...formData, [name]: value }))
  }

  const creatures = (props[filters?.type] as Creature[])?.filter(
    ({ cr, spell }) =>
      (filters.spell === undefined ||
        (filters.spell && spell?.startsWith(formData.spell))) &&
      (filters.maxCR === undefined || cr <= filters.maxCR)
  )

  return (
    <>
      <Filter>
        <form onChange={handleChange}>
          <label htmlFor="spell">Spell</label>
          <select id="spell" name="spell" value={spell} disabled={!mounted}>
            <option value="">{EMPTY}</option>
            {Object.keys(SPELLS).map(spell => (
              <option key={spell}>{spell}</option>
            ))}
          </select>
        </form>
      </Filter>
      <Section>
        <CreatureList creatures={creatures} />
      </Section>
    </>
  )
}

export default Summon
