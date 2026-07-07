import { Icon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import { type ComponentPropsWithoutRef, type FC } from 'react'

import { FilterField } from '~components/Filter'

import styles from './Checkbox.module.scss'

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
  PropTypes.InferProps<Icon.propTypes>

const Checkbox: FC<Props> = ({ id, label, icon, ...rest }) => (
  <FilterField id={id} label={label} className={styles.root}>
    <input
      id={id}
      name={id}
      type="checkbox"
      className={styles.input}
      {...rest}
    />
    <Icon name={icon} className={styles.icon} />
  </FilterField>
)

export default Checkbox
