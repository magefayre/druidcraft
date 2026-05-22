import logoBitmap from '~images/logo.png'
import logoVector from '~images/logo.svg'
import openGraphImage from '~images/sharing.jpg'
import colors from '~styles/colors.module.scss'

const config = {
  url: process.env.NEXT_PUBLIC_SITE_URL,
  name: 'Druidcraft',
  shortName: null,
  title: 'Druidcraft - Wild Shape? I was livid!',
  description: 'Never struggle with choosing a Wild Shape again',
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
