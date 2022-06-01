export const config = {
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  projectId: process.env.SANITY_STUDIO_PROJECTID,
  apiVersion: '2022-05-31', // Learn more: https://www.sanity.io/docs/api-versioning
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: false,
}
