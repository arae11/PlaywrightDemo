/**
 * Gmail OAuth2 Token Generator (Manual Flow)
 *
 * Purpose:
 *  - Performs the manual OAuth2 flow to retrieve and store Gmail API access and refresh tokens.
 *  - Used for authenticating Gmail API access (e.g., for automated testing or email reading).
 *
 * Flow Overview:
 *  1. Loads client credentials from `credentials.json`.
 *  2. Generates an OAuth2 consent URL and prompts the user to authorize the app.
 *  3. Accepts the full redirect URL pasted by the user after login.
 *  4. Extracts the authorization code from the URL.
 *  5. Exchanges the code for access and refresh tokens using Google APIs.
 *  6. Saves the tokens to `token.json`.
 *
 * Key Functions:
 *  - prompt(query): Prompts user input via CLI.
 *  - extractCodeFromUrl(redirectUrl): Extracts and decodes the `code` param from the redirect URL.
 *
 * File Paths:
 *  - `credentials.json`: Client credentials (downloaded from Google Cloud Console).
 *  - `token.json`: Output file where access and refresh tokens are stored.
 *
 * Notes:
 *  - This script must be run manually via the command line.
 *  - Only needs to be done once per Gmail account unless tokens expire or are revoked.
 *  - The Gmail scope used is `https://www.googleapis.com/auth/gmail.readonly`.
 */


import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';

// Paths to credential and token files
const CREDENTIALS_PATH = path.resolve(__dirname, '../resources/secrets/credentials.json');
const TOKEN_PATH = path.resolve(__dirname, '../resources/secrets/token.json');

// Utility to get user input
function prompt(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

// Extract & decode auth code from pasted redirect URL
function extractCodeFromUrl(redirectUrl: string): string {
  const urlObj = new URL(redirectUrl);
  const code = urlObj.searchParams.get('code');
  if (!code) {
    throw new Error('No "code" parameter found in the URL.');
  }
  return decodeURIComponent(code);
}

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8')).installed;
  const { client_secret, client_id, redirect_uris } = credentials;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Step 1: Show URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', 
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  console.log('\n👉 Authorize this app by visiting the following URL:\n');
  console.log(authUrl);

  // Step 2: Ask for full redirect URL, extract code
  const redirectUrl = await prompt('\n🔐 Paste the FULL redirect URL after login: ');
  const code = extractCodeFromUrl(redirectUrl);

  // Step 3: Exchange code for tokens
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Step 4: Save tokens
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('\n✅ Token stored to:', TOKEN_PATH);
}

main().catch(err => {
  console.error('❌ Error during OAuth flow:', err);
});