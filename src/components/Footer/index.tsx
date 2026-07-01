import {
  ContentContainer,
  FooterContainer,
  Grid,
  Icon,
  Navigation,
  SmartLink
} from '@newhighsco/chipset'
import type { FC } from 'react'

import config from '~config'
import footer from '~data/footer.json'
import { ReactComponent as MagefayreSvg } from '~images/magefayre.svg'
import { getVersion } from '~utils/5etools'

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
  <FooterContainer theme={{ root: styles.root }} data-version={getVersion()}>
    <ContentContainer
      gutter
      size="desktopLarge"
      theme={{ content: styles.content }}
    >
      <Grid flex valign="middle" className={styles.columns}>
        <Grid.Item>
          <Navigation
            links={footer.links}
            theme={{ link: styles.link }}
            inline
          />
        </Grid.Item>
        <Grid.Item>
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
