const fs = require('fs');
const path = 'c:\\Users\\usuario\\.gemini\\antigravity\\mcp_config.json';
const newKey = 'ntn_Z81508O03246qoq3HR30FQy8JXAe7FogkwZ1eKMLZCub55';

try {
    const data = fs.readFileSync(path, 'utf8');
    let json = JSON.parse(data);

    const serverKey = Object.keys(json.mcpServers).find(k => k.includes('notion'));

    if (serverKey) {
        const server = json.mcpServers[serverKey];
        if (server.env && server.env.OPENAPI_MCP_HEADERS) {
            let headers = JSON.parse(server.env.OPENAPI_MCP_HEADERS);
            headers['Authorization'] = `Bearer ${newKey}`;
            server.env.OPENAPI_MCP_HEADERS = JSON.stringify(headers);

            fs.writeFileSync(path, JSON.stringify(json, null, 2));
            console.log('SUCCESS: Updated Notion Key.');
        } else {
            // Fallback if headers are not there, maybe try to add them or inspect
            console.log('ERROR: env.OPENAPI_MCP_HEADERS missing.');
        }
    } else {
        console.log('ERROR: notion server not found.');
    }
} catch (e) {
    console.log('ERROR Exception:', e.message);
}
