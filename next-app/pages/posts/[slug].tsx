import type { NextPage } from 'next'
import Head from 'next/head'
import { groq } from 'next-sanity'
import styles from '../../styles/Home.module.css'
import { getClient } from '../../lib/sanity-server'
import { usePreviewSubscription } from '../../lib/sanity'
import { useRouter } from 'next/router'
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

/**
 * Helper function to return the correct version of the document
 * If we're in "preview mode" and have multiple documents, return the draft
 */

function filterDataToSingleItem(data: any, preview: boolean) {
  if (!Array.isArray(data)) {
    return data
  }

  if (data.length === 0) {
    return data[0]
  }

  if (preview) {
    return data.find((item) => item._id.startsWith('drafts.')) || data[0]
  }

  return data[0]
}

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
  const queryParams = { slug: `${params?.slug}` }

  if (!data) return { notFound: true }

  const post = filterDataToSingleItem(data, preview)
  return {
    props: {
      preview,
      post,
      params: preview ? queryParams : null,
    },
  }
}

const Post: NextPage = ({ post, preview, params }: any) => {
  const { asPath } = useRouter()

  const { data: previewData } = usePreviewSubscription(postQuery, {
    params: params || {},
    // The hook will return this on first render
    // This is why it's important to fetch *draft* content server-side!
    initialData: post,
    // The passed-down preview context determines whether this function does anything
    enabled: preview,
  })

  // Client-side uses the same query, so we may need to filter it down again
  const page = filterDataToSingleItem(previewData, preview)

  return (
    <div className={styles.container}>
      <Head>
        <title>Testing NextJS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {preview && (
          <Link href={`/api/exit-preview?slug=${asPath}`}>
            Exit Preview Mode
          </Link>
        )}
        {page?.title && page.title}
        <Link href={`/`}>
          <a>Home</a>
        </Link>
      </main>
    </div>
  )
}

export default Post
