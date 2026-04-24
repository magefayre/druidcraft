import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import yargs from 'yargs'

const BASE = new URL(
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-2014-src/main/data/bestiary/'
)

type Source = string
type Beast = { cr: string; name: string; source: Source }
type Monster = Beast & { type: string }
type Beastiary = { monster: Monster[] }

const parseCR = (cr: string | Pick<Beast, 'cr'>): [number, string] => {
  if (typeof cr !== 'string' && cr?.hasOwnProperty('cr')) return parseCR(cr.cr)
  if (typeof cr === 'string') {
    if (!isNaN(cr as unknown as number)) return [Number(cr), cr]

    const parts = cr?.trim().split('/').filter(Boolean)

    if (parts?.length === 2) {
      return [Number(parts[0]) / Number(parts[1]), cr]
    }
  }

  return [Number.MAX_SAFE_INTEGER, '']
}

const fetchJson = async <T>(url: string = 'index.json'): Promise<T> => {
  const res = await fetch(new URL(url, BASE))

  if (!res.ok)
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)

  return res.json()
}

const filterBeasts = (monsters: Monster[]) =>
  monsters.reduce<Beast[]>((beasts, { cr, name, source, type }) => {
    const [, label] = parseCR(cr)

    return type === 'beast' && !!label
      ? [...beasts, { cr: label, name, source }]
      : beasts
  }, [])

const sortBeasts = (a: Beast, b: Beast) => {
  const [crA] = parseCR(a)
  const [crB] = parseCR(b)

  if (crA != crB) return crA - crB

  return a.name.localeCompare(b.name)
}

;(async () => {
  const { outputDir } = await yargs(process.argv)
    .options({
      outputDir: { alias: 'output', demandOption: true, type: 'string' }
    })
    .parse()

  const sources = await fetchJson<Record<Source, string>>()
  const beasts: Beast[] = []

  await Promise.all(
    Object.values(sources).map(async url => {
      const { monster } = await fetchJson<Beastiary>(url)

      beasts.push(...filterBeasts(monster))
    })
  )

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  await writeFile(
    join(outputDir, 'beasts.json'),
    JSON.stringify(beasts.sort(sortBeasts))
  )
})()
