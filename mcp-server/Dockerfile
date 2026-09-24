# MCP server over Streamable HTTP. Build from the repository root:
#   docker build -f mcp-server/Dockerfile -t nutrition-health-mcp .
#   docker run -p 3000:3000 nutrition-health-mcp   # -> http://localhost:3000/mcp
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY mcp-server/package.json mcp-server/
RUN npm ci --workspace mcp-server --include-workspace-root=false
COPY data data
COPY libs libs
COPY mcp-server mcp-server
RUN npm run build --workspace mcp-server

# The bundle is self-contained (data + dependencies), so the runtime image needs nothing else.
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/mcp-server/dist/nutrition-health-mcp.mjs .
ENV HOST=0.0.0.0 PORT=3000 MCP_TRANSPORT=http
EXPOSE 3000
USER node
CMD ["node", "nutrition-health-mcp.mjs"]
