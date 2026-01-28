# Notion MCP Setup Guide

This guide will help you configure the Notion MCP server to integrate Notion with Cursor AI.

## Prerequisites

1. Notion account with workspace access
2. Node.js 18+ installed
3. Cursor IDE

## Step 1: Get Notion Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Cursor MCP")
4. Select the workspace you want to integrate
5. Click "Submit"
6. Copy the "Internal Integration Token" (starts with `secret_`)

## Step 2: Share Pages with Integration

1. Open the Notion pages you want to access via MCP
2. Click the "..." menu in the top right
3. Click "Add connections"
4. Search for your integration name and select it
5. Repeat for all pages/databases you want to access

## Step 3: Install Notion MCP Server ✅ COMPLETED

The Notion MCP server has been installed globally:

```bash
npm install -g @notionhq/notion-mcp-server
```

You can verify it's installed:
```bash
which notion-mcp-server
```

## Step 4: Configure MCP in Cursor

You'll need to add the Notion MCP configuration to Cursor's MCP settings.

### Option A: Via Cursor Settings (Recommended)

1. Open Cursor Settings (Cmd+,)
2. Search for "MCP" or "Model Context Protocol"
3. Click "Edit in settings.json"
4. Add the Notion server configuration:

```json
{
  "mcp": {
    "servers": {
      "notion": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_API_KEY": "your-notion-integration-token-here"
        }
      }
    }
  }
}
```

### Option B: Create MCP Config File

Create or edit `~/.cursor/mcp_settings.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": [
        "/usr/local/lib/node_modules/@modelcontextprotocol/server-notion/dist/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "your-notion-integration-token-here"
      }
    }
  }
}
```

Replace `your-notion-integration-token-here` with your actual Notion integration token.

## Step 5: Restart Cursor

After adding the configuration:
1. Quit Cursor completely (Cmd+Q)
2. Reopen Cursor
3. The Notion MCP server should now be available

## Step 6: Test the Integration

In Cursor's AI chat, try commands like:

- "Search my Notion workspace for pages about [topic]"
- "Get the content from my Notion page titled [page name]"
- "List all pages in my Notion workspace"
- "Create a new page in Notion"

## Available MCP Tools

Once configured, you'll have access to:

- `notion_search` - Search across your Notion workspace
- `notion_read_page` - Read content from a specific page
- `notion_list_pages` - List all accessible pages
- `notion_create_page` - Create new pages
- `notion_update_page` - Update existing pages
- `notion_query_database` - Query Notion databases

## Troubleshooting

### MCP Server Not Starting

Check the Cursor logs:
1. Open Command Palette (Cmd+Shift+P)
2. Type "Developer: Show Logs"
3. Look for MCP-related errors

### Permission Denied

- Ensure your integration has access to the pages
- Verify the token is correct
- Check that pages are shared with the integration

### Server Command Not Found

If using global install:
```bash
which npx  # Should return a path
npm list -g @modelcontextprotocol/server-notion
```

If not found, reinstall:
```bash
npm install -g @modelcontextprotocol/server-notion
```

## Security Notes

- Keep your Notion integration token secure
- Don't commit it to version control
- Consider using environment variables
- Only share necessary pages with the integration

## Alternative: Use Environment Variables

For better security, store your token in `.env`:

1. Add to your `~/.zshrc` or `~/.bashrc`:
```bash
export NOTION_API_KEY="your-token-here"
```

2. Update MCP config to use the variable:
```json
{
  "mcp": {
    "servers": {
      "notion": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_API_KEY": "${NOTION_API_KEY}"
        }
      }
    }
  }
}
```

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Notion MCP Server GitHub](https://github.com/modelcontextprotocol/servers)

## Next Steps

Once configured, you can:
- Reference Notion pages in your code
- Have the AI read your Notion documentation
- Create project documentation automatically
- Sync code comments with Notion
- Query your Notion knowledge base while coding
