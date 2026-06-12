import type { FC, PropsWithChildren } from 'react'

import Section from '~components/Section'

import styles from './Filter.module.scss'

type Props = PropsWithChildren

const Filter: FC<Props> = ({ children }) => (
  <Section className={styles.root}>{children}</Section>
)

export default Filter
