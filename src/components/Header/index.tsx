import {
  ContentContainer,
  Grid,
  HeaderContainer,
  Navigation,
  SmartLink
} from '@newhighsco/chipset'
import type { FC } from 'react'

import LogoLockup from '~components/LogoLockup'
import header from '~data/header.json'

import styles from './Header.module.scss'

const Header: FC = () => (
  <HeaderContainer theme={{ root: styles.root }}>
    <ContentContainer
      gutter
      size="desktopLarge"
      theme={{ content: styles.content }}
    >
      <Grid flex valign="middle" className={styles.columns}>
        <Grid.Item>
          <SmartLink href="/">
            <LogoLockup />
          </SmartLink>
        </Grid.Item>
        <Grid.Item>
          <Navigation
            links={header.links}
            theme={{ list: styles.links, link: styles.link }}
            inline
          />
        </Grid.Item>
      </Grid>
    </ContentContainer>
  </HeaderContainer>
)

export default Header
export { Header }
