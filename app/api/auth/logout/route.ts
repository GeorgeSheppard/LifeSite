// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server';

/**
 * Signing out using next-auth does not actually sign out with the provider, in this case
 * cognito. So to actually sign out we have to redirect to the logout uri 
 */
export async function GET(request: NextRequest) {
  const redirectUrl = process.env.ENV_LOGIN_LOGOUT_REDIRECT_URL
  const clientId = process.env.ENV_AWS_COGNITO_CLIENT_ID
  const domainUrl = process.env.ENV_AWS_COGNITO_DOMAIN_URL
  
  return NextResponse.redirect(`${domainUrl}/logout?client_id=${clientId}&logout_uri=${redirectUrl}`)
}

export async function POST(request: NextRequest) {
  return GET(request);
} 