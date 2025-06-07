// doesnt need to be touched anymore - authorizeGmail will automatically handle the redirect URL
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