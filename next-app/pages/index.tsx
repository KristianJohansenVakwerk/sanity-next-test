import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { groq } from 'next-sanity'
import styles from '../styles/Home.module.css'
import { getClient } from '../lib/sanity-server'

const postsQuery = groq`
  *[_type=="post"] | order(date asc, _updatedAt asc) {
  _id,
  name,
  title,
  body,
  mainImage,
  'date': publishedAt,
  'slug': slug.current
}`

const Home: NextPage = ({ posts, preview }: any) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Testing NextJS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {posts.map((post: any, index: number) => (
          <div key={index}>
            <Link href={`/posts/${post.slug}`}>
              <a>{post.title}</a>
            </Link>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Home

export async function getStaticProps({ preview = false }: any) {
  const posts = await getClient(preview).fetch(postsQuery)

  return {
    props: {
      preview,
      posts,
    },
  }
}
