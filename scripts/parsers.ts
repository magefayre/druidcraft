import { ELEMENTAL_FORMS, SPEEDS } from '~constants'
import type {
  Abilities,
  Ability,
  Action,
  ActionType,
  Alignment,
  Condition,
  Creature,
  CreatureDetails,
  CreatureType,
  Damage,
  DamageDetails,
  DamageType,
  Features,
  Monster,
  Ratings,
  Size,
  Speeds
} from '~types'
import type { AbilityScore, Entry, EntryList } from '~types/5etools/bestiary'
import { formatList } from '~utils/5etools'

import { filterStrings } from './utils'

export const parseAbilities = (abilities: Record<Ability, AbilityScore>) =>
  Object.entries(abilities).reduce<Abilities>(
    (abilities, [ability, value]) => ({
      ...abilities,
      [ability]: typeof value === 'number' ? value : undefined
    }),
    {}
  )

export const parseActions = (
  actions: Monster[ActionType],
  spellcasting: Action[] = [],
  type?: ActionType
) => {
  const parsed: Action[] = [
    ...(actions ?? []).map(({ name, entries }) => ({
      name,
      entries: entries.flatMap((entry: EntryList) => {
        if (typeof entry === 'string') return entry
        if ('items' in entry)
          return entry.items?.map(item => {
            const {
              name,
              entry,
              entries = [entry]
            } = item as { name: string; entry?: Entry; entries?: Entry[] }

            return `{@subheading ${name}} ${formatList(entries?.filter(filterStrings))}`
          })

        return undefined
      })
    })),
    ...spellcasting.filter(action => action.type === type)
  ]

  if (!parsed.length) return undefined

  return parsed
}

export const parseAlignment = (
  alignments?: Monster['alignment'],
  prefix?: string
): CreatureDetails['alignment'] => {
  if (!alignments?.length) return undefined

  return [
    !!prefix ? ('T' as Alignment) : undefined,
    ...alignments.flatMap(alignment => {
      if (typeof alignment === 'string') return alignment
      if ('special' in alignment) return alignment.special

      return parseAlignment(alignment.alignment)
    })
  ].filter(Boolean)
}

export const parseCR = (cr: Monster['cr']): number | undefined => {
  if (typeof cr !== 'string' && cr?.hasOwnProperty('cr')) return parseCR(cr.cr)
  if (typeof cr === 'string') {
    if (!isNaN(cr as unknown as number)) return Number(cr)

    const parts = cr?.trim().split('/').filter(Boolean)

    if (parts?.length === 2) {
      return Number(parts[0]) / Number(parts[1])
    }
  }

  return undefined
}

export const parseConditions = (conditions: Monster['conditionImmune']) => {
  if (!conditions) return undefined

  return conditions.reduce<Condition[]>((conditions, condition) => {
    if (typeof condition !== 'string') return conditions

    return [...conditions, condition]
  }, [])
}

export const parseDamages = <T extends DamageType>(
  damages: Monster[T],
  type: DamageType
) => {
  if (!damages) return undefined

  return damages.reduce<Array<Damage | DamageDetails>>((damages, damage) => {
    const parse = () => {
      if (typeof damage === 'string') return damage

      if ('special' in damage) return damage.special

      const { note } = damage

      return { [type]: damage[type], note }
    }

    return [...damages, parse()]
  }, [])
}

export const parseRating = (
  name: string,
  features: Features,
  ratings: Ratings
) => {
  if (features?.elementalForms) {
    name = name.replace(ELEMENTAL_FORMS, '$1')
  }

  return Object.keys(ratings).reduce<Creature['rating']>((all, type) => {
    const value = ratings[type][name]

    if (!value) return all

    return { ...all, [type]: value }
  }, undefined)
}

export const parseSize = (sizes: Size[]) => sizes.at(0)

export const parseModifiers = <T extends string>(
  skills: Partial<Record<T, string>>
) => {
  if (!skills) return undefined

  return Object.keys(skills).reduce(
    (parsed, key) => ({ ...parsed, [key]: parseInt(skills[key]) }),
    {}
  )
}

export const parseSpeeds = (speeds: Monster['speed']) => {
  if (typeof speeds === 'number') {
    return { walk: speeds } as Speeds
  }

  return Object.keys(SPEEDS).reduce<Speeds>(
    (parsed, key) => ({ ...parsed, [key]: speeds[key] }),
    {}
  )
}

export const parseSpell = (summonedBySpell?: string) =>
  summonedBySpell?.split('|').at(0)

export const parseSpellcasting = (spellcasting?: Monster['spellcasting']) =>
  spellcasting?.map(
    ({ name, headerEntries, footerEntries, will, daily, displayAs }) => {
      const entries = [
        ...(headerEntries ?? [' ']),
        will &&
          `{@frequency At will} ${formatList(will.filter(filterStrings))}`,
        ...(daily
          ? Object.entries(daily).map(
              ([key, value]) =>
                `{@frequency ${key}} ${formatList(value.filter(filterStrings))}`
            )
          : []),
        ...(footerEntries ?? [])
      ].filter(Boolean)

      return { name, entries, type: displayAs } as Action
    }
  )

export const parseType = (type: Monster['type']): CreatureType => {
  if (
    typeof type !== 'string' &&
    type?.hasOwnProperty('type') &&
    typeof type?.type === 'string' &&
    !type.swarmSize
  ) {
    return parseType(type.type)
  }

  if (typeof type === 'string') return type

  return undefined
}
