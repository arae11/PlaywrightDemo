/**
 * OAuth Redirect URL Code Extractor (Legacy Utility)
 *
 * Purpose:
 *  - Extracts and decodes the OAuth authorization code from a full redirect URL.
 *  - Primarily used for debugging or one-off manual extractions.
 *
 * Context:
 *  - This utility was originally used to manually extract the `code` parameter 
 *    from Google's OAuth2 redirect URL.
 *  - No longer required in normal usage as `authorizeGmail` now handles the full OAuth flow automatically.
 *
 * Functions:
 *  - extractAndDecodeCode(redirectUrl): Extracts and decodes the `code` param from a full redirect URL.
 *
 * Notes:
 *  - This file is mostly for reference or debugging purposes.
 *  - Sample hardcoded URL is provided for testing.
 */

const url = 'http://localhost/?code=4/0AUJR-x7lErbRrLWSSW5vjBEtw7DRPcsCKW9wbVcWNsucVwi7wFZg8-XzHMQtbz7MOfAOUw&scope=https://www.googleapis.com/auth/gmail.readonly';

function extractAndDecodeCode(redirectUrl: string): string {
  const urlObj = new URL(redirectUrl);
  const encodedCode = urlObj.searchParams.get('code');

  if (!encodedCode) {
    throw new Error('No "code" parameter found in the URL.');
  }

  const decodedCode = decodeURIComponent(encodedCode);
  return decodedCode;
}

const decoded = extractAndDecodeCode(url);
console.log('Decoded code:\n', decoded);