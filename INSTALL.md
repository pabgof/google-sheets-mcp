# MCP Google Sheets — installation

Serveur MCP custom pour piloter Google Sheets depuis Claude Code / Desktop.

## Install

```bash
cd mcp-google-sheets
npm install
npm run build   # si pas déjà présent dans build/
```

## Config Claude

Ajoute dans `~/.claude.json` sous `mcpServers` :

```json
"google-sheets": {
  "type": "stdio",
  "command": "node",
  "args": ["/ABSOLUTE/PATH/TO/mcp-google-sheets/build/index.js"],
  "env": {
    "GOOGLE_CLIENT_ID": "<ton_client_id>",
    "GOOGLE_CLIENT_SECRET": "<ton_client_secret>"
  }
}
```

## Credentials Google

Console Google Cloud → OAuth 2.0 Client ID (type "Desktop app") → récupère `client_id` + `client_secret`.
Active les scopes Google Sheets API + Drive API dans le projet.

## Tools fournis

- `list_spreadsheets`, `get_spreadsheet_info`, `add_sheet`, `copy_sheet`, `delete_sheet`
- `read_range`, `batch_read`, `write_range`, `append_rows`, `clear_range`
- `insert_rows_columns`, `delete_rows_columns`, `sort_range`, `find_replace`
- `format_cells` (backgroundColor, textColor, bold, italic, fontSize, alignment, numberFormat)
- `create_spreadsheet`

## Remarques

- Le dossier `node_modules` n'est pas inclus — `npm install` régénère tout.
- `package-lock.json` garantit les versions exactes.
