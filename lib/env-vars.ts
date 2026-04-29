const isDev = process.env.NODE_ENV === "development";

const baseURL = isDev
  ? process.env.NEXT_PUBLIC_DEV_URL
  : process.env.NEXT_PUBLIC_PROD_URL;

const githubClientID = isDev
  ? process.env.GITHUB_DEV_CLIENT_ID
  : process.env.GITHUB_PROD_CLIENT_ID;

const githubClientSecret = isDev
  ? process.env.GITHUB_DEV_CLIENT_SECRET
  : process.env.GITHUB_PROD_CLIENT_SECRET;

export { baseURL, githubClientID, githubClientSecret };
