import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const EMAIL_ENVIRONMENT = "id-preproduction.railcard.co.uk";
const TOKEN_PATH = path.join(__dirname, "..", "resources", "token.json");
const CREDENTIALS_PATH = path.join(
  __dirname,
  "..",
  "resources",
  "credentials.json"
);

async function authenticate(): Promise<OAuth2Client> {
  //console.log("📂 Using credentials file:", CREDENTIALS_PATH);

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
    // Mask sensitive fields
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

  // Helper to partially mask client_id, show only last 6 chars for example
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
  //console.log("Using client_id:", credentials.client_id);

  const oAuth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  //console.log("🔐 Includes refresh_token:", "refresh_token" in token);

  if (!token.refresh_token) {
    throw new Error(
      "❌ Missing refresh_token. Re-run authorizeGmail.ts to generate a valid token."
    );
  }

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

export async function extractConfirmationLink(): Promise<string> {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
    q: 'subject:"Confirm your email address" newer_than:1d',
  });

  const messages = listRes.data.messages;
  if (!messages || messages.length === 0) {
    throw new Error("❌ No messages found matching query");
  }

  for (const messageMeta of messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageMeta.id!,
      format: "full",
    });

    // 🧠 Find the most appropriate body part
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

    console.log("🔍 No link in this message, continuing to next...");
  }

  throw new Error("❌ No verification link found in recent matching emails");
}
