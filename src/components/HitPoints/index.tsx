import { classNames } from '@newhighsco/chipset'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
  type MouseEventHandler,
  useEffect,
  useState
} from 'react'

import DiceRoller from '~components/DiceRoller'

import styles from './HitPoints.module.scss'

type Props = ComponentPropsWithoutRef<'input'> & { min?: number; max: number }

const HitPoints: FC<Props> = ({
  name,
  min = 0,
  max,
  placeholder,
  readOnly
}) => {
  const [current, setCurrent] = useState(max)

  useEffect(() => {
    setCurrent(max)
  }, [name])

  if (readOnly) {
    return (
      <>
        {max} (<DiceRoller>{placeholder}</DiceRoller>)
      </>
    )
  }

  const bloodied = current <= max / 2
  const percentage = (current / max) * 100
  const damage = current - 1
  const heal = current + 1

  const handleChange: MouseEventHandler<HTMLButtonElement> = e => {
    setCurrent(parseInt(e.currentTarget.value))
  }

  return (
    <div
      className={classNames(styles.root, bloodied && styles.bloodied)}
      style={{ '--percentage': `${percentage}%` } as CSSProperties}
    >
      <div className={styles.input}>
        <input
          name="hp"
          type="number"
          value={current}
          min={min}
          max={max}
          readOnly
        />
        <button
          value={damage}
          aria-label="Damage"
          disabled={damage < min}
          onClick={handleChange}
        >
          -
        </button>
        <button
          aria-label="Heal"
          value={heal}
          disabled={heal > max}
          onClick={handleChange}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default HitPoints
