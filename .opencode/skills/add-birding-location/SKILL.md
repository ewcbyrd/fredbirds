---
name: add-birding-location
description: Interactive workflow for adding birding locations with AI-generated descriptions using eBird data and web resources
---

# Add Birding Location Skill

## Overview

This skill guides you through creating a new birding location entry in the fredbirds database with an automatically generated, data-rich description. The description is built by:

1. Gathering species data from associated eBird hotspots
2. Optionally scraping context from the location's official website
3. Categorizing species by taxonomy family (warblers, waterfowl, raptors, etc.)
4. Highlighting rare and conservation-priority birds
5. Generating a professional, comprehensive description following the established pattern

## When to Use This Skill

- User invokes `/add-location` slash command
- User requests to add/create a new birding location
- User mentions adding a preserve, refuge, park, or birding hotspot to the database

## Prerequisites

- Location name
- Geographic coordinates (latitude/longitude in decimal degrees)
- Basic location information (county, state, type)
- Optional: Official website URL for context

## Workflow

### Phase 1: Collect Basic Information

**Prompt for required fields:**

1. **Name** (required, must be unique)
    - "What is the name of this birding location?"
    - Validate: Check against existing locations to ensure uniqueness
    - Use: `fredbirds-api_locations_list_all` then search for duplicates

2. **Latitude** (required, -90 to 90)
    - "What is the latitude in decimal degrees? (e.g., 38.367)"
    - Validate: Must be between -90 and 90
    - Format: Decimal degrees, not DMS

3. **Longitude** (required, -180 to 180)
    - "What is the longitude in decimal degrees? (e.g., -77.333)"
    - Validate: Must be between -180 and 180
    - Format: Decimal degrees, not DMS

**Prompt for optional fields:**

4. **County** (optional but recommended)
    - "What county is this location in? (e.g., Stafford)"
    - Offer to skip if unknown

5. **State** (optional but recommended)
    - "What state is this location in? (use 2-letter code, e.g., VA)"
    - Reference: Use `fredbirds-api_reference_data_get` with type: "states" to show valid options

6. **Type** (optional but recommended)
    - "What type of location is this?"
    - Common options: preserve, refuge, park, beach, hotspot, private, wildlife management area
    - Allow custom entry

7. **Website** (optional)
    - "Does this location have an official website? (full URL)"
    - Validate: Must be valid URL format (https://...)
    - This will be used to scrape additional context for the description

8. **Amenities** (optional, multi-select)
    - "What amenities are available at this location? (select all that apply)"
    - Options:
        - parking
        - trails
        - restrooms
        - observation towers
        - auto tour
        - visitor center
        - accessible
        - kayak launch
        - boat ramp
        - fishing pier
        - picnic area
        - camping
        - boardwalk
    - Allow skipping or selecting multiple

### Phase 2: eBird Integration

**Step 1: eBird Hotspot ID Collection**

**PRIMARY METHOD - Manual Entry:**

Ask: "Please enter one or more eBird hotspot IDs for this location (comma-separated if multiple)"

- Pattern: L followed by digits (e.g., L718303, L2374467)
- Allow multiple IDs separated by commas
- Validate: All hotspot IDs must match pattern `/^L\d+$/`
- Allow user to skip if no eBird hotspots should be associated

**FALLBACK METHOD - Nearby Search (if API available):**

Note: The fredbirds-api_ebird_hotspots_nearby MCP tool may not be available or may have parameter issues. If attempting to use it:

```javascript
fredbirds-api_ebird_hotspots_nearby({
    lat: <provided latitude>,
    long: <provided longitude>,
    dist: 25  // 25km radius
})
```

If this fails, fall back to manual entry immediately.

**Step 2: Gather Species Data**

**Step 2: Gather Species Data**

For each eBird hotspot ID provided:

```javascript
const speciesData = await fredbirds-api_ebird_taxonomy_location({
    locationId: <hotspot ID>
})
```

Aggregate all species across hotspots:

- Create unique list (deduplicate by species code)
- Preserve taxonomy information (family, scientific name, common name)

### Phase 3: Species Analysis & Categorization

**Step 1: Load Reference Data**

```javascript
// Get full taxonomy for family grouping
const fullTaxonomy = (await fredbirds) - api_ebird_taxonomy_full();

// Get rare birds list for highlighting
const rareBirds =
    (await fredbirds) - api_reference_data_get({ type: 'rarebirds' });
```

**Step 2: Categorize Species**

Group species by taxonomy family using family codes. Key categories:

| Category      | Family Code(s)                        | Example Species                            |
| ------------- | ------------------------------------- | ------------------------------------------ |
| Warblers      | Parulidae                             | Cerulean Warbler, Prothonotary Warbler     |
| Waterfowl     | Anatidae                              | Tundra Swan, Canvasback                    |
| Raptors       | Accipitridae, Falconidae, Pandionidae | Bald Eagle, Osprey, Peregrine Falcon       |
| Herons/Egrets | Ardeidae                              | Great Blue Heron, Snowy Egret              |
| Rails         | Rallidae                              | King Rail, Clapper Rail                    |
| Shorebirds    | Charadriidae, Scolopacidae            | Red Knot, Piping Plover                    |
| Gulls/Terns   | Laridae                               | Royal Tern, Caspian Tern                   |
| Woodpeckers   | Picidae                               | Pileated Woodpecker, Red-headed Woodpecker |
| Owls          | Strigidae, Tytonidae                  | Barred Owl, Barn Owl                       |

For reference on family codes, consult the taxonomy data structure.

**Step 3: Identify Notable Species**

Create sublists of notable species:

1. **Rare/Threatened Species**: Cross-reference with `rareBirds` data
2. **Conservation Priority**: Species of concern (from taxonomy or rare birds list)
3. **Specialty Birds**: Uncommon or sought-after species for the region

**Step 4: Calculate Statistics**

Generate counts for description:

- Total unique species count
- Species count per major category (warblers, waterfowl, etc.)
- Number of eBird hotspots represented

### Phase 4: Web Research (Optional)

**If website URL was provided:**

Use webfetch to gather additional context:

```javascript
const webContent = await webfetch({
    url: <provided website>,
    format: 'markdown'
})
```

**Extract relevant information:**

1. **Acreage/Size**: Look for patterns like "733 acres", "3,115-acre"
    - Regex: `/(\d+[,\d]*)\s*acres?/i`

2. **Habitat Types**: Keywords to look for:
    - "marsh", "wetland", "tidal", "freshwater"
    - "forest", "woodland", "hardwood", "upland"
    - "grassland", "meadow", "prairie"
    - "beach", "shoreline", "coastal"
    - "ravine", "creek", "river", "peninsula"

3. **Conservation Status**: Keywords:
    - "preserve", "protected", "refuge"
    - "Important Bird Area", "IBA"
    - "natural area", "wilderness"
    - "conservation", "restoration"

4. **Historical Context**: Look for establishment dates, historical significance

**Fallback**: If web scraping fails or no website provided, skip this enrichment

### Phase 5: Generate Description

**Use the description template** (see description-template.md for details)

**Description Structure:**

1. **Opening sentence(s)**: Size, location, primary habitats
    - "[Acreage from web or 'A'] [type] [in/on] [geographic feature] in [county] County, [state], [habitat description]."
    - Example: "A 3,115-acre wilderness preserve on the Crow's Nest Peninsula in Stafford County, where mature hardwood ravines meet freshwater tidal marshes along the Potomac and Accokeek Creeks."

2. **Conservation context** (if available from web):
    - "One of the finest [habitat type] remaining in the [region]."

3. **Species statistics**:
    - "Over [total count] bird species recorded across [N] eBird hotspot[s], including [X] warbler species and [Y] waterfowl."

4. **Notable species by habitat/category** (2-4 sentences):
    - Organize by: breeding habitat, seasonal occurrence, behavior
    - Highlight conservation-priority species
    - Group related species together
    - Examples:
        - "The steep forested ravines support an exceptional suite of conservation-priority breeders: [species list]."
        - "The freshwater tidal marshes harbor [species list]."
        - "Raptors include [species list]."

5. **Additional category highlights**:
    - Waterfowl, shorebirds, gulls/terns, woodpeckers, owls
    - Mention any standout counts or rare visitors

6. **Access and facilities**:
    - Summarize amenities from user input
    - "Access [description]; [facilities available]."

**Generation Guidelines:**

- Use active, descriptive language
- **Focus on reliable, regularly occurring species** - avoid over-emphasizing rare vagrants
- **Emphasize expected species** that birders can reasonably expect to see during appropriate seasons
- Organize species logically (by habitat, behavior, or family)
- Include specific counts when impressive, but don't list every rarity in the eBird database
- Keep sentences varied in structure
- Match the professional tone of existing examples
- **Quality over quantity** - it's better to accurately describe 50 reliable species than to list 200+ including all vagrants

### Phase 6: Review & Edit Description

**Display generated description to user:**

Present the complete generated description with clear formatting.

**Offer editing options:**

1. **Accept as-is**: Proceed to create location
2. **Edit manually**: Allow user to modify the description text
3. **Regenerate**: If user wants different emphasis or style
4. **Add sections**: Prompt for additional details to incorporate

**Editing prompts:**

- "Would you like to make any changes to this description?"
- "Should I emphasize different species or habitats?"
- "Is there any additional context you'd like to add?"

**Validation**: Ensure final description is not empty and is reasonably detailed

### Phase 7: Create Location

**IMPORTANT: MCP Tool Limitation**

As of this documentation update, the `fredbirds-api_locations_create` MCP tool is **not currently available**. The fredbirds-api MCP server provides tools for events, members, announcements, eBird data, photos, email, and reference data - but not location management.

**Workaround - Export to JSON:**

Instead of creating directly via MCP, export the location data to a JSON file for manual database import:

```javascript
// Create JSON file with location data
const locationData = {
    name: <user-provided name>,
    description: <generated and approved description>,
    lat: <user-provided latitude>,
    lon: <user-provided longitude>,
    county: <user-provided county or undefined>,
    state: <user-provided state or undefined>,
    type: <user-provided type or undefined>,
    website: <user-provided website or undefined>,
    amenities: <user-selected amenities array or undefined>,
    ebirdHotspotIds: <selected eBird IDs array or undefined>,
    isActive: true
};

// Write to file
Write the JSON to a file named: `new-location-{name-slug}.json`
```

**When fredbirds-api_locations_create becomes available:**

```javascript
fredbirds-api_locations_create({
    name: <user-provided name>,
    description: <generated and approved description>,
    lat: <user-provided latitude>,
    lon: <user-provided longitude>,
    county: <user-provided county or undefined>,
    state: <user-provided state or undefined>,
    type: <user-provided type or undefined>,
    website: <user-provided website or undefined>,
    amenities: <user-selected amenities array or undefined>,
    ebirdHotspotIds: <selected eBird IDs array or undefined>
})
```

**The API should automatically add:**

- `_id` (MongoDB ObjectId)
- `geometry` (GeoJSON Point from lat/lon)
- `isActive: true`
- `createdAt` (current timestamp)
- `updatedAt` (current timestamp)

**Handle response:**

- **Success (201)**: Display confirmation with location details
- **ConflictError (409)**: Name already exists, suggest alternative
- **ValidationError (400)**: Show which fields failed validation, offer to retry
- **Other errors**: Display error message and offer to retry

**For JSON Export (current workaround):**

Display summary and file location:

```
✓ Location data prepared successfully!

Name: [name]
Coordinates: [lat], [lon]
eBird Hotspots: [count] associated
Species: [total count] recorded

Description preview:
[first 200 characters]...

📁 Saved to: new-location-{name-slug}.json

Next steps:
1. Import this JSON file into the database manually
2. Or wait for the fredbirds-api_locations_create MCP tool to be added
```

### Phase 8: Confirmation & Next Steps

**Current Workflow (JSON Export):**

After exporting the JSON file, offer follow-up actions:

1. "Review the JSON file contents"
2. "Create another birding location"
3. "Done - I'll import the JSON manually"

**Future Workflow (when MCP tool available):**

On successful creation via API:

Display summary:

```
✓ Location created successfully!

Name: [name]
ID: [_id]
Coordinates: [lat], [lon]
eBird Hotspots: [count] associated
Species: [total count] recorded

Description preview:
[first 200 characters]...
```

**Offer follow-up actions:**

1. "View full location details in database"
2. "Add this location to an upcoming event"
3. "Create another birding location"
4. "Update this location with additional info"
5. "Done"

## Error Handling

### Validation Errors

| Error                   | Handling                                                   |
| ----------------------- | ---------------------------------------------------------- |
| Duplicate name          | Suggest appending county or descriptive suffix             |
| Invalid lat/lon         | Re-prompt with format examples                             |
| Invalid eBird ID format | Show pattern (L followed by digits), re-prompt             |
| Invalid URL             | Show format example (https://...), re-prompt               |
| No species data         | Continue without eBird data, prompt for manual description |

### API Errors

| Error Type            | Handling                                           |
| --------------------- | -------------------------------------------------- |
| eBird API unavailable | Continue without species data, offer manual entry  |
| Website fetch fails   | Skip web enrichment, use user data only            |
| Create location fails | Show error, offer to retry or save data for later  |
| Taxonomy fetch fails  | Use simpler categorization without family grouping |

### Fallback Modes

**If eBird integration fails completely:**

- Offer to create location with manually entered description
- Skip species categorization
- Still validate other fields

**If no nearby hotspots found:**

- Offer to use regional sightings data instead
- Allow manual entry of eBird hotspot IDs
- Or skip eBird association entirely

## Data Quality Guidelines

**Encourage users to:**

1. Verify coordinates are accurate (decimal degrees, not reversed)
2. Use official location names when available
3. Include all relevant eBird hotspots (multiple hotspots per location is common)
4. Provide official website for best description quality
5. Be thorough with amenities to help birders plan visits

**Automated quality checks:**

- Warn if lat/lon appears reversed (e.g., Virginia location with positive longitude)
- Alert if no eBird hotspots found nearby (might indicate coordinate error)
- Flag if name appears to duplicate existing location
- Validate state code against reference data

## Tips for Best Results

**For richest descriptions:**

- Associate 2-3 eBird hotspots if available (shows full diversity)
- Provide official website URL (enables habitat context)
- Use specific location type (helps with description phrasing)
- Include all amenities (helps birders plan visits)

**For notable species emphasis:**

- The skill automatically prioritizes rare/threatened species
- Species with conservation status appear first in descriptions
- Breeding birds are highlighted over migrants when relevant

**For habitat context:**

- Website scraping looks for habitat keywords in first 3 paragraphs
- Official preserve/refuge sites typically have best habitat descriptions
- State park and NWR sites are excellent sources

## Example Invocation

**User**: `/add-location`

**Skill**: "Let's add a new birding location to the database. I'll guide you through the process and help generate a comprehensive description using eBird data."

**Skill**: "What is the name of this birding location?"

**User**: "Belle Isle State Park"

**Skill**: "What is the latitude in decimal degrees? (e.g., 38.367)"

**User**: "37.758"

**Skill**: "What is the longitude in decimal degrees? (e.g., -77.333)"

**User**: "-76.669"

[... continues through workflow ...]

## Technical Notes

**Caching Strategy:**

- Cache full taxonomy data for the session (large dataset, rarely changes)
- Don't cache location-specific data (always fetch fresh)
- Cache rare birds reference data for the session

**Performance:**

- Parallel API calls where possible (multiple hotspot queries)
- Limit nearby hotspot search to reasonable radius (25km default)
- Set timeout on web scraping (10 seconds max)

**Species Categorization:**

- Refer to `species-categorization.md` for detailed family code mappings
- Use common names in descriptions (not scientific names)
- Order species by prominence/conservation status

**Description Templates:**

- Refer to `description-template.md` for formatting patterns
- See `examples.md` for sample inputs and generated outputs

## Related Skills

- `fredbirds-api-client` - API endpoint reference and service patterns
- `api-integration` - General API integration patterns for the project

## Maintenance

**Update this skill when:**

- New location types are added to the database
- Description format/style evolves
- New eBird API endpoints become available
- Additional data sources for enrichment are identified
- User feedback suggests workflow improvements
