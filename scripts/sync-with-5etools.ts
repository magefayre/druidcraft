import { join } from 'node:path'

import plur from 'plur'
import yargs from 'yargs'

import { url } from '~components/Creature/utils'
import { ELEMENTAL_FORMS, LEVELS } from '~constants'
import { loadRatings, writeData } from '~data/utils'
import type {
  Ability,
  Creature,
  CreatureDetails,
  CreatureType,
  Features,
  Monster,
  Ratings,
  Skill
} from '~types'
import type { BestiarySchema } from '~types/5etools/bestiary'
import {
  getCircleFormsCR,
  getTypeCR,
  sortAlphabetically,
  sortCreatures
} from '~utils/5etools'

import {
  parseAbilities,
  parseActions,
  parseAlignment,
  parseConditions,
  parseCR,
  parseDamages,
  parseModifiers,
  parseRating,
  parseSize,
  parseSpeeds,
  parseSpell,
  parseSpellcasting,
  parseType
} from './parsers'
import { fetchData, fetchScript, fetchToken } from './utils'

type MonsterFilters = {
  type: CreatureType
  maxCR?: number
  features?: (name: string) => Features
}

const filterMonsters = (
  monsters: Monster[],
  filters: MonsterFilters,
  ratings: Ratings
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
    const rating = parseRating(base?.name ?? name, features, ratings)
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

  const monsterURLs = await fetchData<Record<string, string>>(
    'bestiary',
    'index.json'
  )
  const monsters: Monster[] = []

  await Promise.all(
    Object.values(monsterURLs).map(async url => {
      const { monster } = await fetchData<BestiarySchema>('bestiary', url)

      monsters.push(
        ...monster.filter(
          ({ isNamedCreature, isNpc, reprintedAs }) =>
            !isNamedCreature && !isNpc && !reprintedAs
        )
      )
    })
  )

  const ratings = await loadRatings(outputDir)
  const data: MonsterFilters[] = [
    {
      type: 'beast',
      maxCR: Math.max(getCircleFormsCR(LEVELS.max), getTypeCR('beast'))
    },
    {
      type: 'elemental',
      maxCR: getTypeCR('elemental'),
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

      await writeData(
        join(outputDir, `${plur(filters.type)}.json`),
        creatures.map(({ summary }) => summary).sort(sortCreatures())
      )

      await Promise.all(
        creatures.map(async ({ details }) => {
          const filename = join(outputDir, `${url(details)}.json`)

          await writeData(filename, details)
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

  await writeData(join(outputDir, 'sources.json'), sources)
})()
