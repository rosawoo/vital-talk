#!/bin/bash

# Notion MCP Configuration Helper Script

echo "🔧 Notion MCP Configuration Helper"
echo "===================================="
echo ""

# Check if notion-mcp-server is installed
if ! command -v notion-mcp-server &> /dev/null; then
    echo "❌ notion-mcp-server not found. Installing..."
    npm install -g @notionhq/notion-mcp-server
else
    echo "✅ notion-mcp-server is installed"
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Get your Notion Integration Token:"
echo "   → Go to: https://www.notion.so/my-integrations"
echo "   → Click '+ New integration'"
echo "   → Name it 'Cursor MCP'"
echo "   → Copy the token (starts with 'secret_')"
echo ""
echo "2. Share your Notion pages with the integration:"
echo "   → Open each page you want to access"
echo "   → Click '...' menu → 'Add connections'"
echo "   → Select your integration"
echo ""
echo "3. Configure Cursor:"
echo "   → Open Cursor Settings (Cmd+,)"
echo "   → Search for 'MCP' or go to settings.json"
echo "   → Add this configuration:"
echo ""
echo "   {"
echo "     \"mcp\": {"
echo "       \"servers\": {"
echo "         \"notion\": {"
echo "           \"command\": \"npx\","
echo "           \"args\": [\"-y\", \"@notionhq/notion-mcp-server\"],"
echo "           \"env\": {"
echo "             \"NOTION_API_KEY\": \"your-token-here\""
echo "           }"
echo "         }"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "4. Restart Cursor (Cmd+Q and reopen)"
echo ""
echo "💡 For better security, you can also set NOTION_API_KEY as an environment variable"
echo "   in your ~/.zshrc file instead of putting it in settings.json"
echo ""
