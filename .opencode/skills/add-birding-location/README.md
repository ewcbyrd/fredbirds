# Add Birding Location Skill

An OpenCode skill for adding birding locations to the fredbirds database with AI-generated, data-rich descriptions.

## Quick Start

Invoke with the slash command:

```
/add-location
```

Or pre-fill the location name:

```
/add-location Belle Isle State Park
```

## What This Skill Does

This skill automates the process of creating professional birding location entries by:

1. **Collecting location data** through interactive prompts
2. **Finding nearby eBird hotspots** automatically
3. **Fetching species data** from associated eBird hotspots
4. **Analyzing and categorizing** bird species by taxonomy
5. **Generating comprehensive descriptions** using templates and eBird data
6. **Scraping additional context** from official websites
7. **Creating the location** in the MongoDB database via fredbirds-api MCP

## Key Features

### Automated Description Generation

The skill generates professional descriptions similar to existing locations by:

- **Species statistics** - "Over 205 bird species recorded across 2 eBird hotspots, including 33 warbler species and 24 waterfowl"
- **Habitat context** - Extracted from official websites when available
- **Notable species** - Highlights conservation-priority and rare species
- **Category organization** - Groups species by habitat, taxonomy, or behavior
- **Professional formatting** - Matches the established tone and structure

### eBird Integration

- Searches for nearby eBird hotspots within 25km
- Fetches complete species lists for each hotspot
- Aggregates unique species across multiple hotspots
- Categorizes species by taxonomy family
- Cross-references with rare birds database

### Validation & Quality

- Ensures coordinates are within valid ranges
- Validates eBird hotspot ID format (L\d+)
- Checks for duplicate location names
- Verifies URL formats for websites
- Warns about potential data quality issues

### Flexible Workflows

- Works with or without eBird hotspot data
- Gracefully handles missing websites
- Supports manual description entry as fallback
- Allows editing generated descriptions before saving

## Files in This Skill

| File                          | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| **SKILL.md**                  | Main skill instructions and complete workflow     |
| **description-template.md**   | Templates and patterns for description generation |
| **species-categorization.md** | Taxonomy grouping logic and family code mappings  |
| **examples.md**               | Sample inputs, outputs, and complete walkthroughs |
| **README.md**                 | This file - quick reference and overview          |

## MongoDB Schema

Locations are stored with the following structure:

**Required fields:**

- `name` - Unique location name
- `description` - Generated comprehensive description
- `lat` - Latitude (-90 to 90)
- `lon` - Longitude (-180 to 180)

**Optional fields:**

- `county` - County name
- `state` - 2-letter state code
- `type` - preserve, refuge, park, beach, hotspot, etc.
- `website` - Official website URL
- `amenities` - Array of amenity strings
- `ebirdHotspotIds` - Array of eBird location IDs

**Auto-generated:**

- `_id` - MongoDB ObjectId
- `geometry` - GeoJSON Point
- `isActive` - Boolean (default true)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## fredbirds-api MCP Tools Used

This skill uses these MCP tools from fredbirds-api:

| Tool                                    | Purpose                              |
| --------------------------------------- | ------------------------------------ |
| `fredbirds-api_ebird_hotspots_nearby`   | Find eBird hotspots near coordinates |
| `fredbirds-api_ebird_taxonomy_location` | Get species list for a hotspot       |
| `fredbirds-api_ebird_taxonomy_full`     | Get complete eBird taxonomy (cached) |
| `fredbirds-api_reference_data_get`      | Get rare birds reference data        |
| `fredbirds-api_locations_create`        | Create new location in database      |
| `fredbirds-api_locations_list_all`      | Check for duplicate names            |

## Example Workflow

**User:** `/add-location`

**Skill:** "Let's add a new birding location. What is the name of this birding location?"

**User:** "Crow's Nest Natural Area Preserve"

**Skill:** "What is the latitude in decimal degrees?"

**User:** "38.367"

**Skill:** "What is the longitude in decimal degrees?"

**User:** "-77.333"

[Skill continues collecting county, state, type, website, amenities...]

**Skill:** "I found 2 nearby eBird hotspots:

1. L2374467 - Crow's Nest NAP--North Entrance (0.1 km)
2. L44152764 - Crow's Nest NAP--Boyd's Hole Trail (0.3 km)

Which hotspots should be associated with this location?"

**User:** "Both"

[Skill fetches species data, categorizes, scrapes website...]

**Skill:** "I've generated a description based on 205 species across 2 eBird hotspots:

[Shows generated description]

Would you like to make any changes to this description?"

**User:** "Looks great, proceed"

**Skill:** [Creates location via MCP]

"✓ Location created successfully! [Shows summary]"

## Tips for Best Results

1. **Accurate coordinates** - Double-check lat/lon are not reversed
2. **Associate multiple hotspots** - More data = richer descriptions
3. **Provide website URL** - Enables habitat context extraction
4. **Be thorough with amenities** - Helps birders plan visits
5. **Review descriptions** - Add local knowledge and seasonal details

## Related Skills

- **fredbirds-api-client** - API endpoint reference
- **api-integration** - General API patterns for the project
- **mui-patterns** - UI patterns (if building location display components)

## Maintenance

Update this skill when:

- New location types are added
- Description format/style evolves
- New eBird API endpoints become available
- Additional data sources for enrichment are identified
- User feedback suggests workflow improvements

---

Created: April 2026  
Last Updated: April 2026
