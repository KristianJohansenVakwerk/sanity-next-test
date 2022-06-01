// Any random string, must match SANITY_PREVIEW_SECRET in the Next.js .env.local file
const previewSecret = "IZ4jD7VWtW2BAC4CPlFw";

// Replace `remoteUrl` with your deployed Next.js site
const remoteUrl = `https://your-nextjs-site.com`;
const localUrl = `http://localhost:3000`;

export default function resolveProductionUrl(doc) {
  const baseUrl =
    window.location.hostname === "localhost" ? localUrl : remoteUrl;

  const previewUrl = new URL(baseUrl);

  previewUrl.pathname = `/api/preview`;
  previewUrl.searchParams.append(`secret`, previewSecret);

  if (doc._type === "post") {
    previewUrl.searchParams.append(
      `slug`,
      `posts/${doc?.slug?.current}` ?? `/`
    );
  } else {
    previewUrl.searchParams.append(`slug`, doc?.slug?.current ?? `/`);
  }

  return previewUrl.toString();
}
