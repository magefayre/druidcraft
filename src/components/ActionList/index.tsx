import { List } from '@newhighsco/chipset'
import { type FC, Fragment, type PropsWithChildren } from 'react'

import type { Action } from '~types'

import styles from './ActionList.module.scss'
import { parseTags } from './utils'

type Props = { heading: string; actions?: Action[] }

export const ActionLabel: FC<PropsWithChildren> = ({ children }) => (
  <>
    <em className={styles.label}>{children}</em>{' '}
  </>
)

const ActionList: FC<Props> = ({ heading, actions }) => {
  if (!actions?.length) return null

  return (
    <div className={styles.actions}>
      <h2>{heading}</h2>
      <List unstyled>
        {actions.map(({ name, entries }) => (
          <li key={name}>
            <h3 className={styles.name}>{parseTags(name)}</h3>
            {entries.map(entry => (
              <Fragment key={entry}>{parseTags(entry)} </Fragment>
            ))}
          </li>
        ))}
      </List>
    </div>
  )
}

export default ActionList
