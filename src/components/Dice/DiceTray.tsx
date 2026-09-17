import { Button } from '@newhighsco/chipset'
import type { FC } from 'react'

import DefinitionList, { Definition } from '~components/DefinitionList'

import styles from './DiceTray.module.scss'
import { useDiceTray } from './hooks'
import { renderRoll } from './utils'

const DiceTray: FC = () => {
  const [rolls, , clearTray] = useDiceTray()

  return (
    <div className={styles.root}>
      <DefinitionList>
        {rolls.map((roll, index) => (
          <Definition
            key={[roll.label, index].join('-')}
            term={roll.label ?? 'Dice'}
          >
            {renderRoll(roll)}
          </Definition>
        ))}
      </DefinitionList>
      <Button.Group>
        <Button type="reset" onClick={() => clearTray()}>
          Clear
        </Button>
        <Button className={styles.close}>Close</Button>
      </Button.Group>
    </div>
  )
}

export default DiceTray
