import { classNames, List } from '@newhighsco/chipset'
import { type FC, Fragment, type PropsWithChildren } from 'react'

import Tags from '~components/Tags'
import type { Action } from '~types'

import styles from './ActionList.module.scss'

type Props = { heading: string; actions?: Action[] }
type LabelProps = PropsWithChildren<{ subheading?: boolean }>

export const ActionLabel: FC<LabelProps> = ({ subheading, ...rest }) => {
  const Component = subheading ? 'h4' : 'span'

  return (
    <>
      <Component
        className={classNames(styles.label, subheading && styles.subheading)}
        {...rest}
      />{' '}
    </>
  )
}

export const ActionName: FC<LabelProps> = ({ subheading, ...rest }) => {
  const Component = subheading ? 'h4' : 'h3'

  return (
    <Component
      className={classNames(styles.name, subheading && styles.subheading)}
      {...rest}
    />
  )
}

const ActionList: FC<Props> = ({ heading, actions }) => {
  if (!actions?.length) return null

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <List unstyled className={styles.list}>
        {actions.map(({ name, entries }) => (
          <li key={name}>
            <ActionName>
              <Tags>{name}</Tags>
            </ActionName>
            {entries.map((entry, index) => (
              <Fragment key={[index, entry].join()}>
                {index > 0 && <br />}
                <Tags>{entry}</Tags>
              </Fragment>
            ))}
          </li>
        ))}
      </List>
    </div>
  )
}

export default ActionList
