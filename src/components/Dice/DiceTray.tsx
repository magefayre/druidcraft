import { Button, useToggle } from '@newhighsco/chipset'
import type { MouseEventHandler, ToggleEventHandler } from 'react'
import { Children, type FC, useEffect } from 'react'

import DefinitionList, { Definition } from '~components/DefinitionList'
import Sprite from '~components/Sprite'

import styles from './DiceTray.module.scss'
import { Dice } from './Die'
import { useDiceTray } from './hooks'
import { renderRoll } from './utils'

const DiceTray: FC = () => {
  const [rolls, , clearTray] = useDiceTray()
  const [visible, , setVisibility] = useToggle(!!rolls.length)

  useEffect(() => {
    if (!!rolls.length) {
      setVisibility(true)
    }
  }, [rolls])

  const handleReset: MouseEventHandler<HTMLButtonElement> = () => {
    clearTray()
    setVisibility(false)
  }

  const handleToggle: ToggleEventHandler<HTMLDetailsElement> = ({
    currentTarget
  }) => {
    setVisibility(currentTarget.open)
  }

  return (
    <details className={styles.root} open={visible} onToggle={handleToggle}>
      <summary
        className={styles.toggle}
        aria-label={`${visible ? 'Close' : 'Open'} dice tray`}
      >
        Dice tray
        <Sprite id={visible ? 'down' : 'up'} />
      </summary>
      {!!rolls.length && (
        <DefinitionList>
          {rolls.map((roll, index) => {
            const entries = Children.toArray(renderRoll(roll))

            return (
              <Definition
                key={[roll.label, index].join('-')}
                term={roll.label ?? 'Dice'}
                className={styles.roll}
              >
                {entries.map((entry, index) => (
                  <span key={[index, entry].join()}>{entry}</span>
                ))}
              </Definition>
            )
          })}
        </DefinitionList>
      )}
      <Button type="reset" onClick={handleReset} className={styles.reset}>
        Clear
      </Button>
      <Dice />
    </details>
  )
}

export default DiceTray
