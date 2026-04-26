---
description: Add a new birding location to the database with AI-generated description
---

Use the `add-birding-location` skill to guide the user through creating a new birding location entry.

The skill will:

1. **Collect basic information** - name, coordinates, county, state, type, website, amenities
2. **Find nearby eBird hotspots** - search within 25km radius and let user select which to associate
3. **Gather species data** - fetch taxonomy for each selected hotspot
4. **Generate comprehensive description** - using eBird data, web scraping, and templates
5. **Review and edit** - let user approve or modify the generated description
6. **Create location** - call fredbirds-api MCP to save to database

Load the skill and begin the interactive workflow. The skill handles all validation, API calls, species categorization, and description generation automatically.

Example invocations:

- `/add-location` - Start fresh workflow
- `/add-location Belle Isle State Park` - Start workflow with name pre-filled

If arguments are provided, use them as the location name and skip that prompt step.
