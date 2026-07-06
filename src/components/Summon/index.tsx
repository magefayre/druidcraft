import type { ChangeEventHandler, FC } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import Select from '~components/Select'
import { SPELL_LEVELS, SPELLS } from '~constants'
import type { Creature, MonsterType, Spell } from '~types'
import {
  formatCR,
  formatCRLimit,
  formatLevel,
  getSpellCR
} from '~utils/5etools'

const getUpcastLevels = ({ level, upcast }: Spell) => {
  if (typeof upcast === 'boolean') {
    return Array.from(
      { length: SPELL_LEVELS.max - level },
      (_, index) => level + index + 1
    )
  }

  return Object.keys(upcast)
}

type FormData = { spell: string; upcast: number }

export type SummonProps = { creatures: Record<MonsterType, Creature[]> }

const Summon: FC<SummonProps> = ({ creatures }) => {
  const [formData, setFormData] = useLocalStorage<FormData>(
    'summon',
    { spell: undefined, upcast: undefined },
    { initializeWithValue: false }
  )
  const filters = SPELLS[formData.spell]

  const handleChange: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const { name, value } = target

    setFormData(formData => {
      const updates = { [name]: value }

      if (name === 'spell' && formData[name] !== value) {
        updates['upcast'] = ''
      }

      return { ...formData, ...updates }
    })
  }

  const maxCR = getSpellCR(filters, formData.upcast)
  const summons = (creatures[filters?.type] as Creature[])?.filter(
    ({ cr, name, spell }) =>
      (maxCR === undefined || cr <= maxCR) &&
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
        <form>
          <Select
            id="spell"
            label="Spell"
            value={formData.spell}
            onChange={handleChange}
            options={[
              { value: '' },
              ...Object.entries(SPELLS).map(([value, { level }]) => ({
                value,
                label: (
                  <>
                    {value} ({formatLevel(level)})
                  </>
                )
              }))
            ]}
          />
          {filters?.upcast && (
            <Select
              id="upcast"
              label="Upcast"
              value={formData.upcast}
              onChange={handleChange}
              options={[
                { value: '' },
                ...getUpcastLevels(filters).map(value => ({
                  value,
                  label: formatLevel(value)
                }))
              ]}
            />
          )}
        </form>
        {maxCR && (
          <dl>
            <dt>Max. CR</dt>
            <dd>{formatCR(maxCR)}</dd>
          </dl>
        )}
      </Filter>
      <Section>
        <CreatureList
          creatures={summons}
          isCreatureDisabled={({ cr }) =>
            typeof filters.limit === 'boolean' &&
            formatCRLimit(cr) === undefined
          }
          isCreatureLimited={({ cr, name }) => {
            const limit =
              filters.creatures?.[name] ||
              (typeof filters.limit === 'boolean' && formatCRLimit(cr)) ||
              (typeof filters.limit === 'number' && filters.limit) ||
              (filters.spell && 1)
            const multiplier = filters.upcast?.[formData.upcast] ?? 1

            return limit * multiplier
          }}
        />
      </Section>
    </>
  )
}

export default Summon
