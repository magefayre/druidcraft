import type { FC } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { CreatureList } from '~components/Creature'
import Filter, { type FilterHandler } from '~components/Filter'
import Section from '~components/Section'
import Select from '~components/Select'
import { SPELLS } from '~constants'
import { useFormData, useSorting } from '~hooks'
import { formatCR, formatCRLimit } from '~utils/5etools'

import { useMaxCR, useSpells, useSummons, useUpcasting } from './hooks'
import type { SummonFormData, SummonProps } from './types'

const defaults: SummonFormData = { sort: 'cr', spell: '', upcast: undefined }

const Summon: FC<SummonProps> = ({ creatures }) => {
  const [formData, setFormData] = useLocalStorage<SummonFormData>(
    'summon',
    defaults,
    { initializeWithValue: false }
  )
  const sorting = useSorting()
  const spells = useSpells()
  const selected = useFormData(formData, defaults)
  const filters = SPELLS[selected.spell]
  const upcasting = useUpcasting(filters)
  const maxCR = useMaxCR(filters, selected.upcast)
  const summons = useSummons({ creatures, filters, maxCR, selected })

  const handleChange: FilterHandler = (id, value) => {
    setFormData(formData => {
      const updates = { [id]: value }

      if (id === 'spell' && formData[id] !== value) {
        updates['upcast'] = ''
      }

      return { ...formData, ...updates }
    })
  }

  return (
    <>
      <Filter>
        <form>
          <Select
            id="spell"
            label="Spell"
            value={selected.spell}
            defaultValue={defaults.spell}
            onChange={handleChange}
            options={spells}
          />
          {filters?.upcast && (
            <Select
              id="upcast"
              label="Upcast"
              value={`${selected.upcast}`}
              defaultValue={`${defaults.upcast}`}
              onChange={handleChange}
              options={upcasting}
            />
          )}
          {selected.spell && (
            <Select
              id="sort"
              label="Sort"
              value={selected.sort}
              onChange={handleChange}
              options={sorting}
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
            const multiplier = filters.upcast?.[selected.upcast] ?? 1

            return limit * multiplier
          }}
        />
      </Section>
    </>
  )
}

export default Summon
