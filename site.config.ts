import logoBitmap from '~images/logo.png'
import logoVector from '~images/logo.svg'
import openGraphImage from '~images/sharing.jpg'
import colors from '~styles/colors.module.scss'

const config = {
  url: process.env.NEXT_PUBLIC_SITE_URL,
  name: 'Druidcraft',
  shortName: null,
  title:
    'Druidcraft - Practical tools for managing Druid Wild Shape and summoning for D&D 5e',
  description:
    'Druid Wild Shape - Never struggle with choosing a Druid Wild Shape for D&D 5e again',
  logo: { bitmap: logoBitmap.src, vector: logoVector },
  openGraphImage: openGraphImage.src,
  themeColor: colors.black,
  twitterHandle: 'magefayre',
  socialLinks: {
    GitHub: 'https://github.com/magefayre/druidcraft',
    X: 'https://x.com/magefayre'
  }
}

export default config
