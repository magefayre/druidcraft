import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import plur from 'plur'
import yargs from 'yargs'

import { ELEMENTAL_FORMS, LEVELS } from '~constants'
import type {
  Creature,
  CreatureType,
  Features,
  Monster,
  MonsterRatings,
  Source,
  Speeds
} from '~types'
import type { BestiarySchema } from '~types/5etools/bestiary'
import {
  getCircleFormsCR,
  getTypeCR,
  sortAlphabetically,
  sortCreatures
} from '~utils/5etools'

import { fetchData, fetchRatings, fetchScript, fetchToken } from './utils'

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

const parseSpeeds = (speeds: Monster['speed']): Speeds => ({
  ...speeds,
  canHover: undefined
})

const parseSpell = (summonedBySpell?: string) =>
  summonedBySpell?.split('|').at(0)

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
  const creatures = monsters.reduce<Creature[]>((creatures, monster) => {
    let base = undefined

    if ('_copy' in monster) {
      const { _copy } = monster

      base = monsters.find(
        ({ name, source }) =>
          _copy.name === name &&
          _copy.name !== monster.name &&
          _copy.source === source
      )

      if (!!base) {
        monster = { ...base, ...monster }
      }
    }

    const { name, source, summonedBySpell } = monster
    const cr = parseCR(monster.cr)!
    const spell = parseSpell(summonedBySpell)
    const type = parseType(monster.type)
    const include =
      type === filters.type &&
      (cr <= (filters.maxCR ?? Number.MAX_SAFE_INTEGER) || (!cr && !!spell))

    if (!include) return creatures

    const speed = parseSpeeds(monster.speed)
    const features = filters.features?.(name)
    const rating = filters.ratings
      ? parseRating(base?.name ?? name, features, ratings)
      : undefined

    return [...creatures, { cr, features, name, rating, source, speed, spell }]
  }, [])

  return creatures
}

;(async () => {
  const { outputDir } = await yargs(process.argv)
    .options({
      outputDir: { alias: 'output', demandOption: true, type: 'string' }
    })
    .parse()

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const monsterURLs = await fetchData<Record<Source, string>>(
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
        JSON.stringify(creatures.sort(sortCreatures()))
      )

      await Promise.all(
        creatures.map(async ({ name, source }) => {
          await fetchToken({ name, source })
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
        creatures.flat().some(creature => creature.source === source) &&
        !books[source]
          ? { ...books, [source]: name }
          : books,
      {}
    )

  await writeFile(join(outputDir, 'sources.json'), JSON.stringify(sources))
})()
