import type { NextApiRequest, NextApiResponse } from 'next'

import { url } from '~components/Creature/utils'
import { loadData } from '~data/utils'
import type { CreatureDetails } from '~types'

const handler = async (
  { query }: NextApiRequest,
  res: NextApiResponse<CreatureDetails>
) => {
  const source = query.source as string
  const name = query.slug as string
  const creature = await loadData<CreatureDetails>(url({ source, name }, false))

  // if (!creature) {

  res.status(200).json(creature)
}

export default handler
