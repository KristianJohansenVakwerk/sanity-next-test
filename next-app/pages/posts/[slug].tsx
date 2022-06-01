import type { NextPage } from 'next'
import Head from 'next/head'
import { groq } from 'next-sanity'
import styles from '../../styles/Home.module.css'
import { getClient } from '../../lib/sanity-server'
import Link from 'next/link'

const postQuery = groq`
  *[_type=="post" && slug.current == $slug] | order(date asc, _updatedAt asc) {
  _id,
  name,
  title,
  body,
  mainImage,
  'date': publishedAt,
  'slug': slug.current
}`

const Post: NextPage = ({ post, preview }: any) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Testing NextJS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {post.title}
        <Link href={`/`}>
          <a>Home</a>
        </Link>
      </main>
    </div>
  )
}

export default Post

export async function getStaticPaths() {
  const allSlugsQuery = groq`*[defined(slug.current)][].slug.current`
  const pages = await getClient().fetch(allSlugsQuery)

  return {
    paths: pages.map((slug: string) => `/posts/${slug}`),
    fallback: true,
  }
}

export async function getStaticProps({ params, preview = false }: any) {
  const data = await getClient(preview).fetch(postQuery, params)
  console.log(data[0])
  return {
    props: {
      preview,
      post: data[0],
    },
  }
}
