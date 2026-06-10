import { Icon } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import React, { type ComponentPropsWithoutRef, type FC, useId } from 'react'

import styles from './Checkbox.module.scss'

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
  PropTypes.InferProps<Icon.propTypes>

const Checkbox: FC<Props> = ({ icon, alt, ...rest }) => {
  const id = useId()

  return (
    <label>
      <input
        type="checkbox"
        {...rest}
        className={styles.input}
        aria-labelledby={id}
      />
      <Icon id={id} name={icon} alt={alt} className={styles.icon} />
    </label>
  )
}

export default Checkbox
