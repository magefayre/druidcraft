import { Icon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { ChangeEventHandler, FC } from 'react'

import type { FilterFieldProps } from '~components/Filter'
import { FilterField } from '~components/Filter'

import styles from './Checkbox.module.scss'

type Props = Omit<FilterFieldProps<'input'>, 'type'> &
  PropTypes.InferProps<Icon.propTypes>

const Checkbox: FC<Props> = ({ id, label, icon, onChange }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    onChange?.(id, e.target.checked)
  }

  return (
    <FilterField id={id} label={label} className={styles.root}>
      <input
        id={id}
        name={id}
        type="checkbox"
        className={styles.input}
        onChange={handleChange}
      />
      <Icon name={icon} className={styles.icon} />
    </FilterField>
  )
}

export default Checkbox
