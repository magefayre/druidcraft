import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import plur from 'plur'
import yargs from 'yargs'

import { url } from '~components/Creature/utils'
import { ELEMENTAL_FORMS, LEVELS } from '~constants'
import type { Action } from '~types'
import {
  type Ability,
  type Aligmnent,
  type Creature,
  type CreatureDetails,
  type Features,
  type Monster,
  type MonsterRatings,
  type Monsters,
  type MonsterSpell,
  type MonsterType,
  type Size,
  type Skill
} from '~types'
import {
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

const parseAlignment = (
  alignment?: Aligmnent[],
  prefix?: string
): Aligmnent[] => {
  if (!alignment?.length) return undefined

  return [!!prefix ? ('T' as Aligmnent) : undefined, ...alignment].filter(
    Boolean
  )
}

const parseCR = (cr: string | { cr: string }): number | undefined => {
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

const parseSpell = (summonedBySpell?: string) =>
  summonedBySpell?.split('|').at(0)

const parseSpellcasting = (spellcasting?: MonsterSpell[]) =>
  spellcasting?.map<Action>(spell => ({
    name: spell.name,
    entries: spell.headerEntries
  }))

const parseType = (type: string | { type: string; swarmSize: string }) => {
  if (
    typeof type !== 'string' &&
    type?.hasOwnProperty('type') &&
    !type.swarmSize
  ) {
    return parseType(type.type)
  }

  if (typeof type === 'string') return type as MonsterType

  return undefined
}

type MonsterFilters = {
  type: MonsterType
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
    const { _copy } = monster
    const base = monsters.find(
      ({ name, source }) =>
        _copy?.name === name &&
        _copy?.name !== monster.name &&
        _copy?.source === source
    )

    if (!!base) {
      monster = { ...base, ...monster }
    }

    const { source, summonedBySpell } = monster
    const cr = parseCR(monster.cr)!
    const spell = parseSpell(summonedBySpell)
    const type = parseType(monster.type)
    const include =
      type === filters.type &&
      (cr <= (filters.maxCR ?? Number.MAX_SAFE_INTEGER) || (!cr && !!spell))

    if (!include) return creatures

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
      speed,
      spellcasting,
      str,
      trait,
      wis,
      vulnerable
    } = monster
    const features = filters.features?.(name)
    const rating = filters.ratings
      ? parseRating(base?.name ?? name, features, ratings)
      : undefined
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
      ability: { str, dex, con, int, wis, cha },
      save: parseModifiers<Ability>(save),
      skill: parseModifiers<Skill>(skill),
      vulnerable,
      resist,
      immune,
      condition,
      senses,
      languages,
      cr,
      trait,
      action,
      spellcasting: parseSpellcasting(spellcasting),
      legendary,
      bonus,
      reaction
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
      const { monster } = await fetchData<Monsters>('bestiary', url)

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
