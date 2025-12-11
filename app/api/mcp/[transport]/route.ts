import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
    (server) => {
        // Tool de prueba: Eco
        server.tool(
            "echo",
            "Devuelve el mensaje que le envíes",
            { message: z.string() },
            async ({ message }) => {
                return {
                    content: [{ type: "text", text: `Echo: ${message}` }],
                };
            }
        );

        // Aquí podemos agregar más tools, por ejemplo para consultar Supabase
        // server.tool(...)
    },
    {
        name: "Next.js MCP Server",
        version: "1.0.0",
    },
    {
        // Esto es CLAVE: debe coincidir con la carpeta donde está este archivo.
        // Como el archivo es app/api/mcp/[transport]/route.ts, la base es /api/mcp
        basePath: "/api/mcp",
        verboseLogs: true,
    }
);

export { handler as GET, handler as POST };
