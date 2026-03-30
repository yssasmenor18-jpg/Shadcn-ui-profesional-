const fs = require('fs');
const path = 'c:\\Users\\usuario\\.gemini\\antigravity\\mcp_config.json';
try {
    const data = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(data);
    console.log('Keys:', Object.keys(json.mcpServers));

    // Find notion key
    const notionKey = Object.keys(json.mcpServers).find(k => k.includes('notion'));
    if (notionKey) {
        console.log(`Notion found as '${notionKey}'`);
        const notion = json.mcpServers[notionKey];
        console.log('Structure:', JSON.stringify(notion, null, 2));
    } else {
        console.log('Notion NOT found.');
    }
} catch (e) { console.error('Error:', e.message); }
