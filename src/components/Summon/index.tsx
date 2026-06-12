import type { ChangeEventHandler, FC } from 'react'

import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import { EMPTY, SPELLS } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import type { Creature, MonsterType } from '~types'
import { formatCR, formatCRLimit } from '~utils/creatures'

type FormData = { spell: string }

export type SummonProps = { creatures: Record<MonsterType, Creature[]> }

const Summon: FC<SummonProps> = ({ creatures }) => {
  const [formData, setFormData, mounted] = useLocalStorage<FormData>('summon', {
    spell: undefined
  })
  const filters = SPELLS[formData.spell]

  const handleChange: ChangeEventHandler<HTMLFormElement> = ({ target }) => {
    const { name, value } = target

    setFormData(formData => ({ ...formData, [name]: value }))
  }

  const summons = (creatures[filters?.type] as Creature[])?.filter(
    ({ cr, name, spell }) =>
      (filters.maxCR === undefined || cr <= filters.maxCR) &&
      (filters.spell === undefined
        ? !spell
        : spell?.toLowerCase() === formData.spell.toLowerCase()) &&
      (filters.creatures === undefined ||
        Object.keys(filters.creatures).some(
          creature => creature.toLowerCase() === name.toLowerCase()
        ))
  )

  return (
    <>
      <Filter>
        <form onChange={handleChange}>
          <label htmlFor="spell">Spell</label>
          <select
            id="spell"
            name="spell"
            value={formData.spell}
            disabled={!mounted}
          >
            <option value="">{EMPTY}</option>
            {Object.keys(SPELLS).map(spell => (
              <option key={spell}>{spell}</option>
            ))}
          </select>
        </form>
        <dl>
          {filters?.maxCR && (
            <>
              <dt>Max. CR</dt>
              <dd>{formatCR(filters.maxCR)}</dd>
            </>
          )}
        </dl>
      </Filter>
      <Section>
        <CreatureList
          creatures={summons}
          isCreatureLimited={({ cr, name }) =>
            filters.creatures?.[name] ||
            (typeof filters.limit === 'boolean' && formatCRLimit(cr)) ||
            (typeof filters.limit === 'number' && filters.limit) ||
            (filters.spell && 1)
          }
        />
      </Section>
    </>
  )
}

export default Summon
