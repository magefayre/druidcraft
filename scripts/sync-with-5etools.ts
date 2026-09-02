import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import plur from 'plur'
import yargs from 'yargs'

import { url } from '~components/Creature/utils'
import { ELEMENTAL_FORMS, LEVELS, SPEEDS } from '~constants'
import type {
  Abilities,
  Action,
  ActionType,
  Condition,
  Damage,
  DamageDetails,
  DamageType,
  Speeds
} from '~types'
import {
  type Ability,
  type Alignment,
  type Creature,
  type CreatureDetails,
  type CreatureType,
  type Features,
  type Monster,
  type MonsterRatings,
  type Size,
  type Skill
} from '~types'
import type { AbilityScore, BestiarySchema } from '~types/5etools/bestiary'
import {
  formatList,
  getCircleFormsCR,
  getTypeCR,
  sortAlphabetically,
  sortCreatures
} from '~utils/5etools'

import {
  ensureDir,
  fetchData,
  fetchRatings,
  fetchScript,
  fetchToken
} from './utils'

const parseAbilities = (abilities: Record<Ability, AbilityScore>) =>
  Object.entries(abilities).reduce<Abilities>(
    (abilities, [ability, value]) => ({
      ...abilities,
      [ability]: typeof value === 'number' ? value : undefined
    }),
    {}
  )

const parseActions = (
  actions: Monster[ActionType],
  spellcasting: Action[] = [],
  type?: ActionType
) => {
  const parsed: Action[] = [
    ...(actions ?? []).map(({ name, entries }) => ({ name, entries })),
    ...spellcasting.filter(action => action.type === type)
  ]

  if (!parsed.length) return undefined

  return parsed
}

const parseAlignment = (
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

const parseCR = (cr: Monster['cr']): number | undefined => {
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

const parseConditions = (
  conditions: Monster['conditionImmune']
): Condition[] => {
  return conditions
}

const parseDamages = <T extends DamageType>(
  damages: Monster[T],
  type: DamageType
) => {
  return damages?.reduce<Array<Damage | DamageDetails>>((damages, current) => {
    const parse = () => {
      if (typeof current === 'string') return current

      if ('special' in current) return current.special

      const { note } = current

      return { [type]: current[type], note }
    }

    return [...damages, parse()]
  }, [])
}

const parseRating = (
  name: string,
  features: Features,
  ratings: MonsterRatings
) => {
  if (features?.elementalForms) {
    name = name.replace(ELEMENTAL_FORMS, '$1')
  }

  return ratings[name]
}

const parseSize = (sizes: Size[]) => sizes.at(0)

const parseModifiers = <T extends string>(
  skills: Partial<Record<T, string>>
) => {
  if (!skills) return undefined

  return Object.keys(skills).reduce(
    (parsed, key) => ({ ...parsed, [key]: parseInt(skills[key]) }),
    {}
  )
}

const parseSpeeds = (speeds: Monster['speed']) => {
  if (typeof speeds === 'number') {
    return { walk: speeds } as Speeds
  }

  return Object.keys(SPEEDS).reduce<Speeds>(
    (parsed, key) => ({ ...parsed, [key]: speeds[key] }),
    {}
  )
}

const parseSpell = (summonedBySpell?: string) =>
  summonedBySpell?.split('|').at(0)

const parseSpellcasting = (spellcasting?: Monster['spellcasting']) =>
  spellcasting?.map<Action>(
    ({
      name,
      headerEntries = [' '],
      footerEntries = [],
      will,
      daily,
      displayAs
    }) => {
      const entries = [
        ...headerEntries,
        will && `{@frequency At will} ${formatList(will)}`,
        ...(daily
          ? Object.entries(daily).map(
              ([key, value]) => `{@frequency ${key}} ${formatList(value)}`
            )
          : []),
        ...footerEntries
      ].filter(Boolean)

      return { name, entries, type: displayAs }
    }
  )

const parseType = (type: Monster['type']): CreatureType => {
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

type MonsterFilters = {
  type: CreatureType
  maxCR?: number
  ratings?: boolean
  features?: (name: string) => Features
}

const filterMonsters = (
  monsters: Monster[],
  filters: MonsterFilters,
  ratings: MonsterRatings
) => {
  const creatures = monsters.reduce<
    { summary: Creature; details: CreatureDetails }[]
  >((creatures, monster) => {
    let base = undefined

    if ('_copy' in monster) {
      const { _copy } = monster

      base = monsters.find(
        ({ name, source }) =>
          _copy?.name === name &&
          _copy?.name !== monster.name &&
          _copy?.source === source
      )

      if (!!base) {
        monster = { ...base, ...monster }
      }
    }

    const { source, summonedBySpell } = monster
    const cr = parseCR(monster.cr)!
    const spell = parseSpell(summonedBySpell)
    const type = parseType(monster.type)
    const include =
      type === filters.type &&
      (cr <= (filters.maxCR ?? Number.MAX_SAFE_INTEGER) || (!cr && !!spell))

    if (!include) return creatures

    const speed = parseSpeeds(monster.speed)
    const {
      ac,
      action,
      alignment,
      alignmentPrefix,
      bonus,
      cha,
      con,
      conditionImmune: condition,
      dex,
      hp,
      immune,
      int,
      languages,
      legendary,
      name,
      reaction,
      resist,
      save,
      senses,
      size,
      skill,
      str,
      trait,
      wis,
      vulnerable
    } = monster
    const features = filters.features?.(name)
    const rating = filters.ratings
      ? parseRating(base?.name ?? name, features, ratings)
      : undefined
    const spellcasting = parseSpellcasting(monster.spellcasting)
    const summary: Creature = {
      name,
      source,
      cr,
      features,
      rating,
      speed,
      spell
    }
    const details: CreatureDetails = {
      name,
      source,
      size: parseSize(size),
      type,
      alignment: parseAlignment(alignment, alignmentPrefix),
      ac,
      hp,
      speed,
      ability: parseAbilities({ str, dex, con, int, wis, cha }),
      save: parseModifiers<Ability>(save),
      skill: parseModifiers<Skill>(skill),
      vulnerable: parseDamages(vulnerable, 'vulnerable'),
      resist: parseDamages(resist, 'resist'),
      immune: parseDamages(immune, 'immune'),
      condition: parseConditions(condition),
      senses,
      languages,
      cr,
      trait: parseActions(trait, spellcasting),
      action: parseActions(action, spellcasting, 'action'),
      legendary: parseActions(legendary),
      bonus: parseActions(bonus),
      reaction: parseActions(reaction)
    }

    return [...creatures, { summary, details }]
  }, [])

  return creatures
}

;(async () => {
  const { outputDir } = await yargs(process.argv)
    .options({
      outputDir: { alias: 'output', demandOption: true, type: 'string' }
    })
    .parse()

  ensureDir(outputDir)

  const monsterURLs = await fetchData<Record<string, string>>(
    'bestiary',
    'index.json'
  )
  const monsters: Monster[] = []

  await Promise.all(
    Object.values(monsterURLs).map(async url => {
      const { monster } = await fetchData<BestiarySchema>('bestiary', url)

      monsters.push(
        ...monster.filter(({ isNpc, reprintedAs }) => !isNpc && !reprintedAs)
      )
    })
  )

  const ratings = await fetchRatings(outputDir)
  const data: MonsterFilters[] = [
    { type: 'beast', maxCR: getCircleFormsCR(LEVELS.max), ratings: true },
    {
      type: 'elemental',
      maxCR: getTypeCR('elemental'),
      ratings: true,
      features: name =>
        ELEMENTAL_FORMS.test(name) ? { elementalForms: true } : undefined
    },
    { type: 'dragon', maxCR: Number.MIN_SAFE_INTEGER },
    { type: 'fey', maxCR: getTypeCR('fey') },
    { type: 'plant', maxCR: 2 }
  ]

  const creatures = await Promise.all(
    data.map(async filters => {
      const creatures = filterMonsters(monsters, filters, ratings)

      await writeFile(
        join(outputDir, `${plur(filters.type)}.json`),
        JSON.stringify(
          creatures.map(({ summary }) => summary).sort(sortCreatures())
        )
      )

      await Promise.all(
        creatures.map(async ({ details }) => {
          const filename = join(outputDir, `${url(details)}.json`)

          ensureDir(filename)

          await writeFile(filename, JSON.stringify(details))
          await fetchToken(details)
        })
      )

      return creatures
    })
  )

  await fetchScript('parser.js')

  const sources = Object.entries(globalThis.Parser.SOURCE_JSON_TO_FULL)
    .sort(([, a], [, b]) => sortAlphabetically(a, b))
    .reduce(
      (books, [source, name]) =>
        creatures.flat().some(({ summary }) => summary.source === source) &&
        !books[source]
          ? { ...books, [source]: name }
          : books,
      {}
    )

  await writeFile(join(outputDir, 'sources.json'), JSON.stringify(sources))
})()
