This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Setting up next/sanity

Add the follwing files

```bash
  /lib/
  – config.js
  – sanity.js
  - sanity-server.js
```

Then add a .env.local file with, find dataset and projectId in sanity.json:

```bash
  NEXT_PUBLIC_SANITY_DATASET='production'
  NEXT_PUBLIC_SANITY_PROJECT_ID='...'
  SANITY_API_TOKEN='...'
  SANITY_PREVIEW_SECRET=''
```

## Live Preview Guideline

Tokens and CORS
You'll need to create an API token in [sanity.io/manage](sanity.io/manage) and allow CORS from your Next.js website.

1. Create a "Read" token, and save it to SANITY_API_TOKEN in .env.local
2. Add a CORS origin from http://localhost:3000 with Credentials Allowed, so that your front-end can communicate with the Studio.

## Preview Mode and API Routes

Next.js has a Preview mode which we can use to set a cookie, which will set the preview mode to true in the above Dynamic Route. Preview mode can be activated by entering the site through an API Route, which will then redirect the visitor to the correct page.

Create two files inside ./web/pages/api

```bash
  /next-app/api/preview.js
  /next-app/api/exit-preview.js
```

```bash
  export default function preview(req, res) {
  if (!req?.query?.secret) {
    return res.status(401).json({message: 'No secret token'})
  }

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({message: 'Invalid secret token'})
  }

  if (!req.query.slug) {
    return res.status(401).json({message: 'No slug'})
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, {Location: `/${req?.query?.slug}` ?? `/`})

  return res.end()
}
```

```bash
  export default function exit(req, res) {
    res.clearPreviewData()

    res.writeHead(307, {Location: req?.query?.slug ?? `/`})
  }
```

## Setting up the Production Preview plugin for Sanity Studio

## Out the box guidelines from next.js

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
