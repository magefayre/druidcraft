import { ELEMENTALS } from '~constants'
import type { Creature } from '~types'

export const isElemental = ({ name }: Creature) => ELEMENTALS.includes(name)
