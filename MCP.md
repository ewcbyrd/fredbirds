# MCP Server Documentation

## Overview

The Fredericksburg Birding Club API includes a Model Context Protocol (MCP) server that exposes API endpoints as AI-accessible tools. This allows AI assistants like Claude to interact with bird club data, eBird sightings, and email functionality through natural language.

## Architecture

The MCP server is a standalone Node.js process that:
- Runs alongside the Express API (different transport)
- Makes HTTP requests to the Express API endpoints
- Exposes 35 tools organized by category
- Requires API key authentication for security

```
┌─────────────────────────────────────────────┐
│         Node.js Environment                 │
│                                              │
│  ┌─────────────────┐   ┌─────────────────┐ │
│  │   Express API   │   │   MCP Server    │ │
│  │   (PORT 3000)   │◄──┤   (stdio)       │ │
│  │                 │   │                  │ │
│  │  - 53 REST      │   │  - 35 MCP tools │ │
│  │    endpoints    │   │  - HTTP client  │ │
│  │  - MongoDB      │   │    calls API    │ │
│  │  - eBird proxy  │   │                  │ │
│  └─────────────────┘   └─────────────────┘ │
│         ▲                       ▲           │
└─────────┼───────────────────────┼───────────┘
          │                       │
    Website/Apps          AI Assistants
                          (Claude, etc.)
```

## Setup

### 1. Environment Variables

Add to your `.env` file:

```bash
# MCP Server Configuration
MCP_API_KEY=your_secure_api_key_here
API_BASE_URL=http://localhost:3000
```

**Required:**
- `MCP_API_KEY` - Secure API key for authenticating MCP requests to the Express API

**Optional:**
- `API_BASE_URL` - Base URL for the Express API (default: http://localhost:3000)

### 2. Running the MCP Server

**Development (local):**
```bash
npm run dev:mcp
```

**Production:**
```bash
npm run start:mcp
```

### 3. Using with OpenCode

Add to your OpenCode MCP servers config:

1. Open OpenCode settings
2. Navigate to MCP Servers configuration
3. Add the fredbirds-api MCP server:

```json
{
  "fredbirds-api": {
    "command": "node",
    "args": ["/absolute/path/to/fredbirds-api/mcp-server.js"],
    "env": {
      "MCP_API_KEY": "your_api_key_here",
      "API_BASE_URL": "http://localhost:3000"
    }
  }
}
```

**Note:** Replace `/absolute/path/to/fredbirds-api` with the actual path to your project.

**Connecting to Azure Production:**
To use the production API hosted on Azure instead of localhost:
```json
{
  "fredbirds-api": {
    "command": "node",
    "args": ["/absolute/path/to/fredbirds-api/mcp-server.js"],
    "env": {
      "MCP_API_KEY": "your_api_key_here",
      "API_BASE_URL": "https://fredbirds-api.azurewebsites.net"
    }
  }
}
```

### 4. Azure Deployment

The MCP server is designed to run locally and connect to the Express API on Azure App Service. See the Azure Deployment section below.

## Available Tools (35 total)

### Events Tools (9 tools)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `events_list_all` | Get all bird club events | None |
| `events_list_by_year` | Get events for specific year | `year` (string) |
| `events_list_upcoming` | Get upcoming events for next N months | `months` (number, 1-12) |
| `events_get_details` | Get event details with attendees | `eventId` (string) |
| `events_create` | Create new event | `event`, `start` |
| `events_update` | Update existing event | `eventId`, `updates` (object) |
| `events_delete` | Delete event | `eventId` |
| `events_add_attendee` | Register member for event | `eventId`, `memberId`, `email`, `firstName`, `lastName` |
| `events_remove_attendee` | Unregister member from event | `eventId`, `memberId` |

**Example Usage:**
```
User: "What bird watching events are coming up in the next 3 months?"
AI: Calls events_list_upcoming with months: 3
```

### Members Tools (9 tools)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `members_list_all` | Get all members | None |
| `members_list_officers` | Get club officers | None |
| `members_list_active` | Get active members | None |
| `members_search_by_email` | Find member by email | `email` (string) |
| `members_search_by_name` | Find members by name | `first`, `last`, `email` |
| `members_get_events` | Get member's event history | `memberId` (string) |
| `members_create` | Create new member | `first`, `last`, `email` |
| `members_update` | Update member info | `memberId`, `updates` (object) |
| `members_get_role` | Get member role | `email` (string) |

**Example Usage:**
```
User: "Who are the club officers?"
AI: Calls members_list_officers
```

### Announcements Tools (4 tools)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `announcements_list` | Get all active announcements | None |
| `announcements_create` | Create new announcement | `date`, `headline`, `details`, `expires` |
| `announcements_update` | Update announcement | `announcementId`, `updates` (object) |
| `announcements_delete` | Delete announcement | `announcementId` |

**Example Usage:**
```
User: "Create an announcement about the spring migration walk"
AI: Calls announcements_create with appropriate data
```

### eBird Birding Data Tools (8 tools)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `ebird_taxonomy_full` | Get complete bird taxonomy | None |
| `ebird_taxonomy_location` | Get species for location | `locationId` (string, e.g., "L12345") |
| `ebird_sightings_region` | Recent sightings by region | `regionCode` (string, e.g., "US-VA") |
| `ebird_sightings_region_notable` | Notable sightings by region | `regionCode` |
| `ebird_sightings_nearby` | Recent sightings near coords | `lat`, `lng` (numbers) |
| `ebird_sightings_nearby_notable` | Notable sightings near coords | `lat`, `lng` |
| `ebird_hotspots_nearby` | Find hotspots near coords | `lat`, `long` (numbers) |
| `ebird_hotspots_details` | Get hotspot details | `locationId` |

**Example Usage:**
```
User: "What rare birds have been spotted near Fredericksburg, VA lately?"
AI: Calls ebird_sightings_nearby_notable with lat: 38.3032, lng: -77.4605
```

### Photos Tools (3 tools)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `photos_list_all` | Get all photos | None |
| `photos_list_carousel` | Get carousel photos | None |
| `photos_create` | Add new photo | `header`, `cloudinary_public_id` |

### Email Tool (1 tool)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `email_send` | Send email via SMTP | `to`, `subject`, `html` |

**Example Usage:**
```
User: "Email all officers about tomorrow's board meeting"
AI: 
  1. Calls members_list_officers to get officer emails
  2. Calls email_send with officer emails and meeting details
```

### Reference Data Tool (1 tool)

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `reference_data_get` | Get reference data | `type` (enum: "states", "counties", "rarebirds", "newsfeeds") |

## Usage Examples

### Example 1: Event Management
```
User: "Create a field trip to Belle Isle State Park on April 15, 2026 at 8am"
AI: Calls events_create with:
  - event: "Field Trip to Belle Isle State Park"
  - start: "2026-04-15T08:00:00Z"
  - locations: [{lat: 37.7836, lon: -76.6403}]
```

### Example 2: Member Engagement
```
User: "How many events has john@example.com attended this year?"
AI:
  1. Calls members_search_by_email with email: "john@example.com"
  2. Calls members_get_events with memberId from step 1
  3. Filters results to current year and counts
```

### Example 3: Bird Sightings
```
User: "What birding hotspots are near Fredericksburg with notable sightings?"
AI:
  1. Calls ebird_hotspots_nearby with lat: 38.3032, long: -77.4605
  2. For each hotspot, calls ebird_sightings_region_notable
  3. Summarizes results
```

### Example 4: Announcements
```
User: "Announce the annual meeting on May 1st, expires June 1st"
AI: Calls announcements_create with:
  - date: "2026-04-05"
  - headline: "Annual Meeting - May 1st"
  - details: "Join us for our annual meeting..."
  - expires: "2026-06-01"
```

## Security

### API Key Authentication

The MCP server requires an API key (`MCP_API_KEY`) to authenticate requests to the Express API. This prevents unauthorized access to your API endpoints.

**Important:**
- Keep your `MCP_API_KEY` secure and never commit it to version control
- Use a strong, randomly generated key (minimum 32 characters)
- Rotate the key periodically
- Use different keys for development and production

**Generating a secure API key:**
```bash
# macOS/Linux
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Express API Middleware

To enable API key authentication in the Express API, you'll need to add middleware to validate the `X-MCP-API-Key` header. See the Express API documentation for implementation details.

## Azure Deployment

### Run MCP Server Locally (Recommended)

The MCP server runs locally and connects to the Express API on Azure App Service. This is the recommended approach.

**Setup:**

1. Set environment variables in your `.env` file:
```bash
MCP_API_KEY=your_secure_key_here
API_BASE_URL=https://fredbirds-api.azurewebsites.net
```

2. Run the MCP server:
```bash
npm run start:mcp
```

**Pros:**
- No additional Azure costs
- MCP access restricted to local/trusted environments
- Simple setup

**Note:** MCP servers use stdio transport which is designed for local use. The MCP server connects to the remote Azure-hosted API but itself runs locally.

## Troubleshooting

### MCP Server Won't Start

**Error:** `Missing required environment variable: MCP_API_KEY`
- **Solution:** Set `MCP_API_KEY` in your `.env` file

**Error:** `ECONNREFUSED` when calling API
- **Solution:** Ensure Express API is running on the configured port (default: 3000)
- **Solution:** Check `API_BASE_URL` is correct

### Tools Returning Errors

**Error:** `API Error (401): Unauthorized`
- **Solution:** Verify `MCP_API_KEY` matches the key configured in Express API middleware

**Error:** `API Error (404): Not Found`
- **Solution:** Check that the Express API endpoint exists and is correctly mapped in the tool definition

**Error:** `Missing required parameters`
- **Solution:** Ensure all required parameters are provided when calling the tool

### OpenCode Integration

**MCP server not appearing in OpenCode:**
- Verify the absolute path to `mcp-server.js` is correct
- Check that environment variables are set in the MCP server config
- Restart OpenCode after config changes
- Check OpenCode logs for errors
- Ensure the Express API is running and accessible at `API_BASE_URL`

## Development

### Adding New Tools

To add a new tool to the MCP server:

1. Define the tool in the `TOOLS` array in `mcp-server.js`:

```javascript
{
    name: "your_tool_name",
    description: "Clear description of what the tool does",
    inputSchema: {
        type: "object",
        properties: {
            param1: {
                type: "string",
                description: "Description of parameter"
            }
        },
        required: ["param1"]
    },
    handler: async (params) => {
        validateRequired(params, ["param1"]);
        const response = await makeApiCall("GET", "/your-endpoint", {
            params: params
        });
        return formatResponse(response.data, "Summary message");
    }
}
```

2. Test the tool locally
3. Update this documentation with the new tool

### Testing Tools

Test individual tools using the MCP inspector or by integrating with Claude Desktop and asking questions that trigger the tools.

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [eBird API Documentation](https://documenter.getpostman.com/view/664302/S1ENwy59)
- [fredbirds-api Express API Documentation](./README.md)

## Support

For issues or questions:
1. Check this documentation
2. Review the Express API endpoint documentation in `README.md`
3. Check the Express API logs for errors
4. Verify environment variables are set correctly
