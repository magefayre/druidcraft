import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import plur from 'plur'
import yargs from 'yargs'

import { url } from '~components/Creature/utils'
import { ELEMENTAL_FORMS, LEVELS } from '~constants'
import type {
  Creature,
  Features,
  Monster,
  MonsterRatings,
  Monsters,
  MonsterType,
  Source
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

const parseSpell = (summonedBySpell?: string) =>
  summonedBySpell?.split('|').at(0)

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
  const creatures = monsters.reduce<Creature[]>((creatures, monster) => {
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

    const { name, source, speed } = monster
    const cr = parseCR(monster.cr)!
    const spell = parseSpell(monster.summonedBySpell)
    const type = parseType(monster.type)
    const features = filters.features?.(name)
    const rating = filters.ratings
      ? parseRating(base?.name ?? name, features, ratings)
      : undefined

    const details = {
      ability: {
        str: monster.str,
        dex: monster.dex,
        con: monster.con,
        int: monster.int,
        wis: monster.wis,
        cha: monster.cha
      },
      ac: monster.ac,
      action: monster.action,
      alignment: monster.alignment,
      hp: monster.hp,
      // passive: monster.passive,
      senses: monster.senses,
      skill: monster.skill,
      size: monster.size,
      trait: monster.trait,
      type
    }

    return type === filters.type &&
      (cr <= (filters.maxCR ?? Number.MAX_SAFE_INTEGER) || (!cr && !!spell))
      ? [
          ...creatures,
          { cr, details, features, name, rating, source, speed, spell }
        ]
      : creatures
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

  const monsterURLs = await fetchData<Record<Source, string>>(
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
        JSON.stringify(creatures.sort(sortCreatures()))
      )

      await Promise.all(
        creatures.map(async ({ name, source, details, ...rest }) => {
          const filename = join(outputDir, `${url({ source, name })}.json`)

          ensureDir(filename)

          await writeFile(
            filename,
            JSON.stringify({ name, ...details, ...rest })
          )
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
