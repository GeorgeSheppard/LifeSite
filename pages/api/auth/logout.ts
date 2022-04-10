import { NextApiResponse, NextApiRequest } from 'next';

/**
 * Signing out using next-auth does not actually sign out with the provider, in this case
 * cognito. So to actually sign out we have to redirect to the logout uri 
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(`${process.env.COGNITO_DOMAIN_URL}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${process.env.COGNITO_LOGOUT_URL}`)
}