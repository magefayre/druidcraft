import {
  ContentContainer,
  Grid,
  HeaderContainer,
  Navigation,
  SmartLink
} from '@newhighsco/chipset'
import React, { type FC } from 'react'

import LogoLockup from '~components/LogoLockup'
import header from '~data/header.json'

import styles from './Header.module.scss'

type Props = { size?: string }

const Header: FC<Props> = ({ size = 'desktopLarge' }) => (
  <>
    <HeaderContainer theme={{ root: styles.root }}>
      <ContentContainer gutter size={size} theme={{ content: styles.content }}>
        <Grid flex valign="middle">
          <Grid.Item className={styles.logo}>
            <SmartLink href="/">
              <LogoLockup />
            </SmartLink>
          </Grid.Item>
          <Grid.Item className={styles.links}>
            <Navigation links={header.links} theme={{ link: styles.link }} />
          </Grid.Item>
        </Grid>
      </ContentContainer>
    </HeaderContainer>
  </>
)

export default Header
export { Header }
