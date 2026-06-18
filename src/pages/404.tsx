import { Prose } from '@newhighsco/chipset'
import { type NextPage } from 'next'

import PageContainer from '~components/PageContainer'
import Section from '~components/Section'

const meta = {
  title: 'Page not found',
  description: 'Sorry, this page could not be found',
  noindex: true,
  nofollow: true
}

const NotFoundPage: NextPage = () => (
  <PageContainer meta={meta}>
    <Section>
      <Prose>
        <h1>{meta.title}</h1>
        <p>We’re sorry but we couldn’t find the page you were looking for</p>
      </Prose>
    </Section>
  </PageContainer>
)

export default NotFoundPage
