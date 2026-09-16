import { Button } from '@newhighsco/chipset'
import { type ComponentPropsWithRef, type FC, useId } from 'react'

import Sprite from '~components/Sprite'

import styles from './Dialog.module.scss'

type Props = ComponentPropsWithRef<'dialog'>

export const Dialog: FC<Props> = ({ children, ...rest }) => {
  const id = useId()

  return (
    <dialog id={id} className={styles.root} {...rest}>
      {children}
      {children && (
        <Button className={styles.close} command="close" commandfor={id}>
          <Sprite id="close" alt="Close" />
        </Button>
      )}
    </dialog>
  )
}

export default Dialog
