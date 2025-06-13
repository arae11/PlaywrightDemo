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