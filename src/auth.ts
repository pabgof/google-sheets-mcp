#!/usr/bin/env node
/**
 * Script d'authentification OAuth2 pour Google Sheets
 * Lance un serveur local pour recevoir le callback OAuth2
 * et stocke le refresh token.
 */

import { google } from "googleapis";
import { createServer } from "http";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const CONFIG_DIR = join(homedir(), ".config", "mcp-google-sheets");
const TOKEN_PATH = join(CONFIG_DIR, "tokens.json");

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Erreur: Definissez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET");
    console.error("");
    console.error("1. Allez sur https://console.cloud.google.com/apis/credentials");
    console.error("2. Creez un OAuth 2.0 Client ID (type: Desktop App)");
    console.error("3. Activez l'API Google Sheets dans votre projet");
    console.error("4. Exportez les variables:");
    console.error("   export GOOGLE_CLIENT_ID=votre_client_id");
    console.error("   export GOOGLE_CLIENT_SECRET=votre_client_secret");
    console.error("5. Relancez: npm run auth");
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:3456/callback");

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n=== Authentification Google Sheets MCP ===\n");
  console.log("Ouvrez cette URL dans votre navigateur:\n");
  console.log(authUrl);
  console.log("\nEn attente du callback...\n");

  // Try to open browser automatically
  try {
    const open = (await import("open")).default;
    await open(authUrl);
    console.log("(Navigateur ouvert automatiquement)");
  } catch {
    console.log("(Ouvrez l'URL manuellement)");
  }

  return new Promise<void>((resolve) => {
    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith("/callback")) return;

      const url = new URL(req.url, "http://localhost:3456");
      const code = url.searchParams.get("code");

      if (!code) {
        res.writeHead(400);
        res.end("Erreur: pas de code d'autorisation");
        return;
      }

      try {
        const { tokens } = await oauth2Client.getToken(code);

        await mkdir(CONFIG_DIR, { recursive: true });
        await writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:50px">
            <h1>✅ Authentification reussie !</h1>
            <p>Le token a ete sauvegarde. Vous pouvez fermer cette fenetre.</p>
            <p>Redemarrez Claude Code pour utiliser le MCP Google Sheets.</p>
          </body></html>
        `);

        console.log("\nAuthentification reussie !");
        console.log(`Token sauvegarde dans ${TOKEN_PATH}`);
        console.log("\nVous pouvez maintenant utiliser le MCP Google Sheets.");

        server.close();
        resolve();
      } catch (error) {
        res.writeHead(500);
        res.end(`Erreur: ${error}`);
        console.error("Erreur:", error);
      }
    });

    server.listen(3456, () => {
      console.log("Serveur callback en ecoute sur http://localhost:3456");
    });
  });
}

main().catch(console.error);
