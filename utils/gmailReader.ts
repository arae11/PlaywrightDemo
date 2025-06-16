/**
 * Gmail Confirmation Link Extractor (OAuth2 - Gmail API)
 * 
 * Purpose:
 *  - Authenticates to Gmail using OAuth2 credentials and token files.
 *  - Searches for the most recent confirmation email sent to a given target email.
 *  - Extracts the confirmation link from email content (both HTML and plaintext).
 *  - Retries multiple times to wait for email arrival (useful in automation flows).
 * 
 * Key Exports:
 *  - `extractConfirmationLink(targetEmail)`: Main function that retrieves confirmation link for provided email address.
 * 
 * Features:
 *  - Uses OAuth2 credentials stored in `resources/secrets/credentials.json` and `token.json`.
 *  - Supports masked credential logging for secure debug visibility.
 *  - Configurable retry count and delay via environment variables:
 *      - `EMAIL_RETRY_COUNT` (default: 5)
 *      - `EMAIL_RETRY_DELAY_MS` (default: 10000 ms)
 *  - Only scans emails received in the past day with subject `"Confirm your email address"`.
 *  - Parses both `text/html` and `text/plain` email parts.
 *  - Extracts first URL matching the environment host: `id-preproduction.railcard.co.uk`.
 * 
 * Usage Notes:
 *  - Before running this, you must generate valid OAuth2 tokens using `authorizeGmail.ts`.
 *  - This file is typically called by Playwright or test automation flows during registration.
 * 
 * Dependencies:
 *  - googleapis
 *  - google-auth-library
 *  - fs, path (for credential/token file access)
 */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const MAX_RETRIES = parseInt(process.env.EMAIL_RETRY_COUNT || "5", 10);
const DELAY_MS = parseInt(process.env.EMAIL_RETRY_DELAY_MS || "10000", 10);
const EMAIL_ENVIRONMENT = "id-preproduction.railcard.co.uk";
const TOKEN_PATH = path.join(
  __dirname, 
  "..", 
  "resources", 
  "secrets", 
  "token.json"
);
const CREDENTIALS_PATH = path.join(
  __dirname,
  "..",
  "resources",
  "secrets",
  "credentials.json"
);

async function authenticate(): Promise<OAuth2Client> {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`❌ File does not exist at path: ${CREDENTIALS_PATH}`);
  }

  const rawContent = fs.readFileSync(CREDENTIALS_PATH, "utf8");

  // Parse JSON so we can mask the secret safely
  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    console.error("❌ Failed to parse credentials.json for masking.");
    parsed = null;
  }

  if (parsed && parsed.installed) {
    parsed.installed.client_secret = "****MASKED****";
    parsed.installed.client_id = maskString(parsed.installed.client_id);

    const divider = "═".repeat(80);
    const labelWidth = 22;

    console.log(`\n${divider}`);
    console.log("🔐  MASKED CREDENTIALS CONTENT");
    console.log(divider);

    const logRow = (label: string, value: string) =>
      console.log(`${label.padEnd(labelWidth)}: ${value}`);

    logRow("🔑 client_id", parsed.installed.client_id);
    logRow("🔒 client_secret", parsed.installed.client_secret);
    logRow("🌐 auth_uri", parsed.installed.auth_uri);
    logRow("🔗 token_uri", parsed.installed.token_uri);
    logRow(
      "🛡️ auth_provider_url",
      parsed.installed.auth_provider_x509_cert_url
    );
    logRow("🔄 redirect_uris", parsed.installed.redirect_uris.join(", "));

    console.log(divider + "\n");
  } else {
    console.log("\n❌ Could not parse credentials to mask.");
    console.log(rawContent);
  }

  function maskString(str: string) {
    if (!str || str.length < 6) return "****MASKED****";
    return "****" + str.slice(-6);
  }

  let raw: any;
  try {
    raw = JSON.parse(rawContent);
  } catch (err) {
    throw new Error(`❌ Failed to parse credentials.json: ${err}`);
  }

  if (!raw.installed) {
    throw new Error('❌ Missing "installed" property in credentials.json');
  }

  const credentials = raw.installed;

  const oAuth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

  if (!token.refresh_token) {
    throw new Error(
      "❌ Missing refresh_token. Re-run authorizeGmail.ts to generate a valid token."
    );
  }

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

export async function extractConfirmationLink(
  targetEmail: string
): Promise<string> {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(
      `🔎 Attempt ${attempt}/${MAX_RETRIES} to find confirmation email...`
    );

    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: `to:${targetEmail} subject:"Confirm your email address" newer_than:1d`,
    });

    const messages = listRes.data.messages;
    if (!messages || messages.length === 0) {
      console.log("📭 No messages found in this attempt.");
    } else {
      for (const messageMeta of messages) {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: messageMeta.id!,
          format: "full",
        });

        const headers = msg.data.payload?.headers || [];

        const deliveredToHeader = headers.find(
          (h) => h.name?.toLowerCase() === "delivered-to"
        );

        if (
          typeof deliveredToHeader?.value !== "string" ||
          deliveredToHeader.value.toLowerCase() !== targetEmail.toLowerCase()
        ) {
          console.log(
            `⏭️ Skipping message. Delivered-To: "${deliveredToHeader?.value}", Expected: "${targetEmail}"`
          );
          continue;
        }

        // ✅ Email is for the correct recipient — now extract the link
        const parts = msg.data.payload?.parts || [];
        const htmlPart = parts.find((p) => p.mimeType === "text/html");
        const plainPart = parts.find((p) => p.mimeType === "text/plain");

        const bodyData =
          htmlPart?.body?.data ||
          plainPart?.body?.data ||
          msg.data.payload?.body?.data;

        if (!bodyData) continue;

        const decodedBody = Buffer.from(bodyData, "base64").toString("utf-8");

        const regex = new RegExp(`https://${EMAIL_ENVIRONMENT}[^"\\s]+`, "g");
        const matches = decodedBody.match(regex);

        if (!matches || matches.length === 0) {
          console.error(
            "❌ No confirmation link found — full decoded body was:\n",
            decodedBody
          );
          throw new Error("❌ No confirmation link found");
        }

        const confirmationLink = matches[0].replace(/&amp;/g, "&");

        const separator = "═".repeat(80);
        console.log(`\n${separator}`);
        console.log("✅ EMAIL VERIFICATION LINK FOUND");
        console.log(`${separator}`);
        console.log(confirmationLink);
        console.log(separator + "\n");

        return confirmationLink;
      }
    }

    // Wait and retry
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  throw new Error(
    `❌ Timed out waiting for confirmation email to: ${targetEmail}`
  );
}
