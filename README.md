# google-sheets-mcp

Serveur MCP (Model Context Protocol) pour piloter Google Sheets depuis Claude Code / Claude Desktop via OAuth2.

## Features

Lecture, écriture, création, formatage de spreadsheets Google.

**Tools fournis :**

- `list_spreadsheets`, `get_spreadsheet_info`, `add_sheet`, `copy_sheet`, `delete_sheet`
- `read_range`, `batch_read`, `write_range`, `append_rows`, `clear_range`
- `insert_rows_columns`, `delete_rows_columns`, `sort_range`, `find_replace`
- `format_cells` (backgroundColor, textColor, bold, italic, fontSize, alignment, numberFormat)
- `create_spreadsheet`

## Install

```bash
git clone https://github.com/pabgof/google-sheets-mcp.git
cd google-sheets-mcp
npm install
npm run build
```

## Credentials Google

1. Console Google Cloud → APIs & Services → **OAuth 2.0 Client ID** (type **Desktop app**)
2. Active **Google Sheets API** + **Google Drive API**
3. Récupère `client_id` + `client_secret`

## Authentification

```bash
export GOOGLE_CLIENT_ID=ton_client_id
export GOOGLE_CLIENT_SECRET=ton_client_secret
npm run auth
```

Ouvre un navigateur, valide → token stocké dans `~/.config/mcp-google-sheets/tokens.json`.

## Config Claude

Ajoute dans `~/.claude.json` sous `mcpServers` :

```json
"google-sheets": {
  "type": "stdio",
  "command": "node",
  "args": ["/ABSOLUTE/PATH/TO/google-sheets-mcp/build/index.js"],
  "env": {
    "GOOGLE_CLIENT_ID": "<ton_client_id>",
    "GOOGLE_CLIENT_SECRET": "<ton_client_secret>"
  }
}
```

Redémarre Claude.

## Scopes OAuth

- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file`

## License

MIT
