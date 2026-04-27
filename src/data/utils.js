import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const loadData = async file =>
  await readFile(join(process.cwd(), 'src/data', file), 'utf8').then(content =>
    JSON.parse(content)
  )
