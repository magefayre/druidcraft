import {
  ContentContainer,
  FooterContainer,
  Grid,
  Icon,
  Navigation,
  SmartLink
} from '@newhighsco/chipset'
import React, { type FC } from 'react'

import config from '~config'
import footer from '~data/footer.json'
import { ReactComponent as MagefayreSvg } from '~images/magefayre.svg'

import styles from './Footer.module.scss'

const { name, socialLinks } = config
const iconLinks = {
  GitHub: { icon: 'simple-icons:github', verb: 'Star' },
  Magefayre: {
    href: 'https://magefayre.com/',
    verb: '',
    preposition: 'built by',
    children: <MagefayreSvg />
  }
}

const Footer: FC = () => (
  <FooterContainer theme={{ root: styles.root }}>
    <ContentContainer
      gutter
      size="desktopLarge"
      theme={{ content: styles.content }}
    >
      <Grid valign="middle">
        <Grid.Item sizes={['one-half']}>
          <Navigation links={footer.links} theme={{ link: styles.link }} />
        </Grid.Item>
        <Grid.Item sizes={['one-half']} align="right">
          <Navigation
            inline
            links={Object.values(iconLinks)}
            renderLink={(
              {
                href,
                icon,
                verb = 'Follow',
                preposition = 'on',
                children,
                ...rest
              },
              index
            ) => {
              const key = Object.keys(iconLinks).at(index)

              return (
                <SmartLink
                  href={href ?? socialLinks[key]}
                  target="_blank"
                  {...rest}
                >
                  <Icon
                    name={icon}
                    theme={{ root: styles.icon }}
                    alt={[verb, name, preposition, key].join(' ').trim()}
                  >
                    {children}
                  </Icon>
                </SmartLink>
              )
            }}
            theme={{ link: styles.iconLink }}
          />
        </Grid.Item>
      </Grid>
    </ContentContainer>
  </FooterContainer>
)

export default Footer
export { Footer }
