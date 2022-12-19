# Architecture

## Frontend

- Next.js
- React Query
- Material UI
- NextAuth
- ThreeJS and React Three Fiber

## Backend

- AWS
  - Cognito
  - S3
    - User - Each user is given their own folder which is their user ID
      - Images - Folder for any images the user uploads
      - Models - Folder for any models for the printing page the user uploads e.g. STL, 3MF
      - profile.json - As of the time of writing, all user data is stored in one json file. The json is separated by pages, e.g. data required for printing page will be under the property 'printing'. The json connects with other resources in S3 using the object key. To retrieve an object we create a signed URL from the object key.
- Vercel
  - Any public static files are placed under the `public` folder.

## Deployment

Vercel is used for deployment, there are a few things to be aware of:

1. .env and .env.local are obviously not committed, so any production variables need to be entered into Vercel manually.
2. Vercel creates a domain to host the website from, and it is important that this URL matches anything on AWS. Things that spring to mind are: Cognito callback and sign in URL, logout URL called through API route. There are no scripts to automate this, but the production URL remains the same.

There are currently two environments, one for production and one for development. The scripts under `aws/scripts` by default will use development environment variables and will switch to production if the `--prod` flag is passed in.
