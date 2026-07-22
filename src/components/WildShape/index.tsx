import type { FC } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import Checkbox from '~components/Checkbox'
import { CreatureList } from '~components/Creature'
import Filter, { type FilterHandler } from '~components/Filter'
import Section from '~components/Section'
import Select from '~components/Select'
import { LEVELS } from '~constants'
import { useFormData, useSorting } from '~hooks'
import { formatCR, formatSpeedLimits, getSpeedLimit } from '~utils/5etools'

import {
  useLevels,
  useMaxCR,
  useSources,
  useSpeeds,
  useWildShapes
} from './hooks'
import type { WildShapeFormData, WildShapeProps } from './types'

const defaults: WildShapeFormData = {
  level: LEVELS.walk,
  circleForms: false,
  sort: 'cr',
  source: [],
  speed: ''
}

const WildShape: FC<WildShapeProps> = ({ creatures }) => {
  const [formData, setFormData] = useLocalStorage<WildShapeFormData>(
    'wildshape',
    defaults,
    { initializeWithValue: false }
  )
  const selected = useFormData(formData, defaults)
  const { level, circleForms, sort, source, speed } = selected
  const maxCR = useMaxCR(selected)
  const wildShapes = useWildShapes(creatures.beast, selected)
  const levels = useLevels(circleForms)
  const speeds = useSpeeds(level)
  const sources = useSources(creatures.beast)
  const sorting = useSorting()

  const handleChange: FilterHandler = (id, value) => {
    setFormData(formData => ({ ...formData, [id]: value }))
  }

  return (
    <>
      <Filter>
        <form>
          <Checkbox
            id="circleForms"
            label="Moon Druid"
            icon={['boxicons:moon', circleForms && 'filled']
              .filter(Boolean)
              .join('-')}
            checked={circleForms}
            onChange={handleChange}
          />
          <Select
            id="level"
            label="Level"
            value={`${level}`}
            onChange={handleChange}
            options={levels}
          />
          <Select
            id="speed"
            label="Speed"
            value={speed}
            defaultValue={defaults.speed}
            onChange={handleChange}
            options={speeds}
          />
          <Select
            id="source"
            label="Source"
            value={source}
            defaultValue={defaults.source}
            onChange={handleChange}
            multiple
            options={sources}
          />
          <Select
            id="sort"
            label="Sort"
            value={sort}
            onChange={handleChange}
            options={sorting}
          />
        </form>
        <dl>
          <dt>Max. CR</dt>
          <dd>{formatCR(maxCR)}</dd>
          <dt>Limitations</dt>
          <dd>{formatSpeedLimits(level)}</dd>
        </dl>
      </Filter>
      <Section>
        <CreatureList
          creatures={wildShapes}
          isCreatureDisabled={({ cr, speed }) =>
            !maxCR ||
            cr > maxCR ||
            getSpeedLimit(level, speed, 'swim') ||
            getSpeedLimit(level, speed, 'fly')
          }
          ratings
          speedLimits
        />
      </Section>
    </>
  )
}

export default WildShape
