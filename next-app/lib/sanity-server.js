import { createClient } from 'next-sanity'
import { config } from './config'

// Set up the client for fetching data in the getProps page function
export const sanityClient = createClient(config)

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_STUDIO_API_TOKEN,
})

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient
