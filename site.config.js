import logoBitmap from '~images/logo.png'
import logoVector from '~images/logo.svg'
import openGraphImage from '~images/sharing.jpg'
import colors from '~styles/colors.module'

const config = {
  url: process.env.NEXT_PUBLIC_SITE_URL,
  name: 'Druidcraft',
  shortName: null,
  title: 'Druidcraft - Wildshape? I was livid!',
  description: 'TODO:',
  logo: { bitmap: logoBitmap.src, vector: logoVector },
  openGraphImage: openGraphImage.src,
  themeColor: colors.black,
  twitterHandle: 'magefayre',
  socialLinks: {
    github: 'https://github.com/magefayre/druidcraft',
    twitter: 'https://x.com/magefayre'
  }
}

export default config
