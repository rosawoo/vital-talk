# Notion MCP Quick Start 🚀

## ✅ What's Already Done

- ✅ Notion MCP server installed globally (`@notionhq/notion-mcp-server`)
- ✅ Configuration template created
- ✅ Helper scripts prepared

## 🔑 Step 1: Get Your Notion Token (5 minutes)

1. Open https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Fill in:
   - Name: `Cursor MCP`
   - Associated workspace: Select your workspace
4. Click **"Submit"**
5. **Copy the "Internal Integration Token"** (starts with `secret_`)
6. Keep this token safe!

## 🔗 Step 2: Share Pages with Integration

For each Notion page/database you want to access:

1. Open the page in Notion
2. Click the **"..."** menu (top right)
3. Scroll down and click **"Add connections"**
4. Search for and select **"Cursor MCP"**
5. Click **"Confirm"**

💡 You can share entire workspaces by doing this on the workspace root page.

## ⚙️ Step 3: Configure Cursor

### Method 1: Via Cursor Settings UI (Recommended)

1. Open Cursor
2. Press `Cmd+,` (or Cursor → Settings)
3. Click the **{}** icon in the top right to open `settings.json`
4. Add this configuration (merge with existing settings):

```json
{
  "window.commandCenter": true,
  "redhat.telemetry.enabled": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "claudeCode.preferredLocation": "panel",
  "editor.unicodeHighlight.ambiguousCharacters": false,
  "mcp": {
    "servers": {
      "notion": {
        "command": "npx",
        "args": ["-y", "@notionhq/notion-mcp-server"],
        "env": {
          "NOTION_API_KEY": "secret_YOUR_TOKEN_HERE"
        }
      }
    }
  }
}
```

5. Replace `secret_YOUR_TOKEN_HERE` with your actual Notion token
6. Save the file (`Cmd+S`)

### Method 2: Using Environment Variable (More Secure)

1. Edit your shell profile:
```bash
nano ~/.zshrc
```

2. Add this line at the end:
```bash
export NOTION_API_KEY="secret_YOUR_TOKEN_HERE"
```

3. Save and reload:
```bash
source ~/.zshrc
```

4. In Cursor settings.json, use:
```json
"mcp": {
  "servers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

## 🔄 Step 4: Restart Cursor

1. Quit Cursor completely (`Cmd+Q`)
2. Reopen Cursor
3. Wait a few seconds for MCP to initialize

## ✅ Step 5: Test It!

In Cursor's AI chat, try these commands:

**Search your workspace:**
```
Search my Notion for pages about "vital-talk"
```

**List all pages:**
```
Show me all my Notion pages
```

**Read a specific page:**
```
Read the content from my Notion page titled "Project Plan"
```

**Create a new page:**
```
Create a new Notion page called "Meeting Notes" with today's date
```

## 🎯 What You Can Do with Notion MCP

- 📝 **Reference Docs**: "Based on my Notion documentation, how should I..."
- 🔍 **Search Knowledge Base**: "Search my Notion for examples of..."
- ✍️ **Auto-Document**: "Create Notion documentation for this code"
- 📊 **Query Databases**: "Show me all tasks in my Notion database"
- 🔄 **Sync**: "Update my Notion page with this information"

## 🐛 Troubleshooting

### MCP Server Not Loading

Check Cursor Developer Tools:
1. `Cmd+Shift+P` → "Developer: Toggle Developer Tools"
2. Look for errors in Console tab
3. Check if notion-mcp-server is running

### "Token Invalid" Error

- Verify token starts with `secret_`
- Check token has no extra spaces
- Ensure integration wasn't deleted

### "Page Not Found"

- Make sure you shared the page with the integration
- Try sharing the parent workspace/page
- Wait a few minutes after sharing

### Server Not Starting

```bash
# Test manually
npx @notionhq/notion-mcp-server

# Check installation
npm list -g @notionhq/notion-mcp-server

# Reinstall if needed
npm uninstall -g @notionhq/notion-mcp-server
npm install -g @notionhq/notion-mcp-server
```

## 📚 Advanced Usage

### Multiple Workspaces

You can configure multiple Notion integrations:

```json
"mcp": {
  "servers": {
    "notion-work": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_WORK_TOKEN"
      }
    },
    "notion-personal": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_PERSONAL_TOKEN"
      }
    }
  }
}
```

### Available MCP Tools

The Notion MCP server provides these tools:

- `query-data-source` - Query Notion databases
- `retrieve-a-data-source` - Get database info
- `update-a-data-source` - Modify databases
- `create-a-data-source` - Create new databases
- `list-data-source-templates` - List templates
- `move-page` - Move pages around
- `search` - Search all content
- `retrieve-a-page` - Get page content
- `update-page-properties` - Modify page metadata
- `append-block-children` - Add content to pages

## 🔒 Security Best Practices

- ✅ Use environment variables for tokens
- ✅ Only share necessary pages
- ✅ Regularly rotate integration tokens
- ✅ Never commit tokens to git
- ✅ Use read-only integrations when possible

## 📖 Resources

- [Notion API Docs](https://developers.notion.com/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Notion MCP GitHub](https://github.com/makenotion/notion-mcp-server)
- [Setup Guide](./NOTION_MCP_SETUP.md) (detailed version)

## ✨ Next Steps

Once working:
1. Share your most important pages with the integration
2. Try natural language queries about your Notion content
3. Use it to reference documentation while coding
4. Create automated documentation workflows

---

**Need help?** Check the detailed setup guide in `NOTION_MCP_SETUP.md` or the troubleshooting section above.
