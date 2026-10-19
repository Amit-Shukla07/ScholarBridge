import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

async function startListener() {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const redirectUri = (redirect_uris && redirect_uris.length > 0) ? redirect_uris[0] : 'http://localhost';

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const code = parsedUrl.searchParams.get('code');

      if (code) {
        console.log(`[AutoAuth] Received authorization code. Exchanging token...`);
        const { tokens } = await oAuth2Client.getToken(code);
        await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log(`[AutoAuth] ✅ Success! Saved refreshed token to token.json!`);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>ScholarBridge • Google Auth Success</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; }
    p { color: #94a3b8; line-height: 1.6; }
    .badge { display: inline-block; background: #065f46; color: #34d399; padding: 0.4rem 1rem; border-radius: 9999px; font-weight: 600; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ Connected</div>
    <h1>Authentication Successful!</h1>
    <p>Your Google Classroom and Calendar credentials have been securely stored in ScholarBridge.</p>
    <p>You can close this tab and return to ScholarBridge — all Classroom tools and upcoming deadlines are now live!</p>
  </div>
</body>
</html>
        `);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ScholarBridge OAuth callback listener is waiting for code...');
      }
    } catch (e: any) {
      console.error(`[AutoAuth] Error handling request:`, e.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error exchanging token: ${e.message}`);
    }
  });

  server.listen(80, () => {
    console.log(`[AutoAuth] OAuth callback listener running on http://localhost:80 (waiting for Google redirect)`);
  });
}

startListener().catch(console.error);
