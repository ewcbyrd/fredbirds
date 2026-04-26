#!/bin/bash
cd /Users/scottbyrd/Repos/fredbirds-api

# Load .env file from fredbirds repo if environment variables not set
if [ -z "$MCP_API_KEY" ] && [ -f "/Users/scottbyrd/Repos/fredbirds/.env" ]; then
    export $(grep -v '^#' /Users/scottbyrd/Repos/fredbirds/.env | grep 'MCP_API_KEY=' | xargs)
fi

if [ -z "$API_BASE_URL" ]; then
    export API_BASE_URL="https://fredbirds-api.azurewebsites.net"
fi

exec node mcp-server.js
