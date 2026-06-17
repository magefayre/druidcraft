import type { ChangeEventHandler, FC } from 'react'

import { CreatureList } from '~components/Creature'
import Filter from '~components/Filter'
import Section from '~components/Section'
import { EMPTY, SPELL_LEVELS, SPELLS } from '~constants'
import useLocalStorage from '~hooks/useLocalStorage'
import type { Creature, MonsterType, Spell } from '~types'
import { formatCR, formatCRLimit, formatLevel } from '~utils/creatures'

const getMaxCR = (spell?: Spell, level?: number) => {
  if (typeof spell?.upcast === 'boolean' && level) {
    return level
  }

  return spell?.maxCR
}

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
  const [formData, setFormData, mounted] = useLocalStorage<FormData>('summon', {
    spell: undefined,
    upcast: undefined
  })
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

  const maxCR = getMaxCR(filters, formData.upcast)
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
          <label htmlFor="spell">Spell</label>
          <select
            id="spell"
            name="spell"
            value={formData.spell}
            disabled={!mounted}
            onChange={handleChange}
          >
            <option value="">{EMPTY}</option>
            {Object.entries(SPELLS).map(([spell, { level }]) => (
              <option key={spell} value={spell}>
                {spell} ({formatLevel(level)})
              </option>
            ))}
          </select>
          {filters?.upcast && (
            <>
              <label htmlFor="upcast">Upcast</label>
              <select
                id="upcast"
                name="upcast"
                value={formData.upcast}
                onChange={handleChange}
              >
                <option value="">{EMPTY}</option>
                {getUpcastLevels(filters).map(level => (
                  <option key={level} value={level}>
                    {formatLevel(level)}
                  </option>
                ))}
              </select>
            </>
          )}
        </form>
        <dl>
          {maxCR && (
            <>
              <dt>Max. CR</dt>
              <dd>{formatCR(maxCR)}</dd>
            </>
          )}
        </dl>
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
