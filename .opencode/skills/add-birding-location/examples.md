# Add Birding Location - Examples

This document provides complete example workflows showing inputs, API responses, and generated descriptions.

## Example 1: Nature Preserve (Forest & Wetland)

### Input Data

```javascript
{
    name: "Crow's Nest Natural Area Preserve",
    lat: 38.367,
    lon: -77.333,
    county: "Stafford",
    state: "VA",
    type: "preserve",
    website: "https://www.dcr.virginia.gov/natural-heritage/natural-area-preserves/crowsnest",
    amenities: ["parking", "trails"]
}
```

### Step 1: Find Nearby eBird Hotspots

**API Call:**

```javascript
fredbirds -
    api_ebird_hotspots_nearby({
        lat: 38.367,
        long: -77.333,
        dist: 25
    });
```

**Response (sample):**

```javascript
[
    {
        locId: 'L2374467',
        locName: "Crow's Nest NAP--North Entrance",
        lat: 38.367,
        lng: -77.333,
        distance: 0.1
    },
    {
        locId: 'L44152764',
        locName: "Crow's Nest NAP--Boyd's Hole Trail",
        lat: 38.365,
        lng: -77.331,
        distance: 0.3
    }
];
```

**User Selection:** Both hotspots (L2374467, L44152764)

### Step 2: Fetch Species Data

**API Calls:**

```javascript
// For each hotspot
const species1 =
    (await fredbirds) -
    api_ebird_taxonomy_location({
        locationId: 'L2374467'
    });
const species2 =
    (await fredbirds) -
    api_ebird_taxonomy_location({
        locationId: 'L44152764'
    });
```

**Combined Unique Species Count:** 205 species

**Category Breakdown:**

- Warblers (Parulidae): 33 species
- Waterfowl (Anatidae): 24 species
- Raptors: 8 species
- Herons/Egrets: 10 species
- Rails: 5 species
- Gulls/Terns: 9 species
- Woodpeckers: 7 species

### Step 3: Identify Notable Species

**Conservation Priority Breeders:**

- Cerulean Warbler (Setophaga cerulea)
- Prothonotary Warbler (Protonotaria citrea)
- Worm-eating Warbler (Helmitheros vermivorum)
- Kentucky Warbler (Geothlypis formosa)
- Louisiana Waterthrush (Parkesia motacilla)

**Marsh Specialists:**

- King Rail (Rallus elegans) - regional concern
- Least Bittern (Ixobrychus exilis)
- American Bittern (Botaurus lentiginosus)
- Marsh Wren (Cistothorus palustris)

**Notable Raptors/Others:**

- Bald Eagle
- Osprey
- Peregrine Falcon
- Barred Owl
- American Barn Owl
- American White Pelican (rare visitor)
- Royal Tern
- Caspian Tern

### Step 4: Web Scraping Results

**Extracted from Website:**

- Acreage: "3,115 acres"
- Location: "Crow's Nest Peninsula"
- Habitats: "mature hardwood ravines", "freshwater tidal marshes", "Potomac and Accokeek Creeks"
- Conservation: "one of the finest upland hardwood forests remaining in the Virginia Coastal Plain"
- Access: "limited to designated trails"

### Step 5: Generated Description

```
A 3,115-acre wilderness preserve on the Crow's Nest Peninsula in Stafford County, where mature hardwood ravines meet freshwater tidal marshes along the Potomac and Accokeek Creeks. One of the finest upland hardwood forests remaining in the Virginia Coastal Plain.

Over 205 bird species recorded across two eBird hotspots, including 33 warbler species and 24 waterfowl.

The steep forested ravines support an exceptional suite of conservation-priority breeders: Cerulean Warbler, Prothonotary Warbler, Worm-eating Warbler, Kentucky Warbler, and Louisiana Waterthrush. The freshwater tidal marshes harbor King Rail, Least Bittern, American Bittern, and Marsh Wren.

Raptors include Bald Eagle, Osprey, Peregrine Falcon, Barred Owl, and American Barn Owl. The Potomac frontage draws 9 gull and tern species including Royal Tern and Caspian Tern, plus American White Pelican.

All 7 expected Virginia woodpecker species are present, led by Pileated and Red-headed Woodpecker. Access is limited to designated trails; no facilities beyond parking and trail access.
```

---

## Example 2: National Wildlife Refuge (Coastal)

### Input Data

```javascript
{
    name: "Bombay Hook National Wildlife Refuge",
    lat: 39.259473,
    lon: -75.474358,
    county: "Kent",
    state: "DE",
    type: "refuge",
    website: "https://www.fws.gov/refuge/bombay-hook",
    amenities: [
        "parking",
        "restrooms",
        "trails",
        "observation towers",
        "auto tour",
        "visitor center",
        "accessible"
    ]
}
```

### Step 1: Find Nearby eBird Hotspots

**User Selection:** L109171, L126637

### Step 2: Species Statistics

**Combined Unique Species:** 340+ species

**Category Breakdown:**

- Shorebirds: 44 species
- Waterfowl: 44 species
- Herons/Egrets: 12 species
- Rails: 8 species
- Ibises: 4 species
- Raptors: 26 species
- Warblers: 36 species
- Gulls/Terns: 18 species

### Step 3: Notable Species

**Globally/Federally Threatened:**

- Red Knot (globally threatened)
- Piping Plover (federally threatened)

**Rare Vagrants:**

- Curlew Sandpiper
- Little Stint
- Sharp-tailed Sandpiper
- Northern Lapwing

**Uncommon Waterfowl:**

- Pink-footed Goose
- Garganey
- Eurasian Wigeon

**Rare Rails:**

- Yellow Rail (secretive, uncommon)

**Rare/Unusual:**

- Roseate Spoonbill
- Golden Eagle
- Snowy Owl
- Short-eared Owl
- Rough-legged Hawk

### Step 4: Web Scraping Results

- Acreage: "15,978 acres"
- Established: "1937"
- Purpose: "migratory waterfowl on the Atlantic Flyway"
- Habitats: "tidal salt marsh, freshwater impoundments, upland fields, and woodland"
- Features: "12-mile auto tour route"

### Step 5: Generated Description

```
A 15,978-acre national wildlife refuge along Delaware Bay, established in 1937 for migratory waterfowl on the Atlantic Flyway. Features tidal salt marsh, freshwater impoundments, upland fields, and woodland.

Over 340 bird species recorded across two eBird hotspots, making it one of the premier birding destinations on the Atlantic Coast.

Shorebird diversity is extraordinary with 44 species including the globally threatened Red Knot, federally threatened Piping Plover, and rare vagrants such as Curlew Sandpiper, Little Stint, Sharp-tailed Sandpiper, and Northern Lapwing.

Waterfowl are equally impressive at 44 species, highlighted by large Snow Goose concentrations in fall and winter, plus uncommon visitors like Pink-footed Goose, Garganey, and Eurasian Wigeon.

The marshes support 12 heron and egret species, 8 rail species including the secretive Yellow Rail, and 4 ibis species including Roseate Spoonbill. Raptors number 26 species with Bald Eagle, Golden Eagle, Snowy Owl, Short-eared Owl, and Rough-legged Hawk among the highlights. Warblers total 36 species.

Includes a 12-mile auto tour route with observation towers and a visitor center.
```

---

## Example 3: State Park (Riverfront)

### Input Data

```javascript
{
    name: "Belle Isle State Park",
    lat: 37.758,
    lon: -76.669,
    county: "Lancaster",
    state: "VA",
    type: "state park",
    website: "https://www.dcr.virginia.gov/state-parks/belle-isle",
    amenities: [
        "parking",
        "trails",
        "restrooms",
        "boat ramp",
        "fishing pier"
    ]
}
```

### Step 1: Find Nearby eBird Hotspots

**User Selection:** L5577823, L8829104

### Step 2: Species Statistics

**Combined Unique Species:** 187 species

**Category Breakdown:**

- Waterfowl: 31 species
- Warblers: 28 species
- Gulls/Terns: 15 species
- Shorebirds: 18 species
- Raptors: 12 species
- Herons/Egrets: 9 species

### Step 3: Notable Species

**Breeding Marsh/Coastal Specialties:**

- Saltmarsh Sparrow (conservation concern)
- Seaside Sparrow
- Clapper Rail
- Marsh Wren

**Breeding Forest Warblers:**

- Yellow-throated Warbler
- Northern Parula
- Prothonotary Warbler

**Coastal Species:**

- Royal Tern
- Caspian Tern
- Black Skimmer

**Nesting Raptors:**

- Osprey
- Bald Eagle

**Winter Waterfowl:**

- Tundra Swan
- Canvasback
- Bufflehead

### Step 4: Web Scraping Results

- Acreage: "733 acres"
- Location: "peninsula with 7 miles of Rappahannock River shoreline"
- Habitats: "tidal wetlands, forested uplands, and sandy beaches"

### Step 5: Generated Description

```
A 733-acre state park on the Rappahannock River in Lancaster County, Virginia, featuring tidal wetlands, forested uplands, and sandy beaches. The park is situated on a peninsula with 7 miles of Rappahannock River shoreline.

Over 187 bird species recorded across 2 eBird hotspots, including 28 warbler species and 31 waterfowl species.

The tidal marshes support breeding Saltmarsh Sparrow, Seaside Sparrow, Clapper Rail, and Marsh Wren. Forested areas host summer populations of Yellow-throated Warbler, Northern Parula, and Prothonotary Warbler.

The riverfront attracts 15 species of gulls and terns including Royal Tern, Caspian Tern, and Black Skimmer. Osprey and Bald Eagle nest along the shoreline.

Waterfowl are abundant in fall and winter, with large concentrations of Tundra Swan, Canvasback, and Bufflehead. Shorebird diversity peaks during spring and fall migration.

Access via designated trails with parking, restrooms, boat ramp, and fishing pier available.
```

---

## Example 4: Small Local Park (No Website)

### Input Data

```javascript
{
    name: "River Road Park",
    lat: 38.298,
    lon: -77.465,
    county: "Stafford",
    state: "VA",
    type: "park",
    website: null,  // No official website
    amenities: ["parking", "trails"]
}
```

### Step 1: Find Nearby eBird Hotspots

**User Selection:** L15234567 (single hotspot)

### Step 2: Species Statistics

**Combined Unique Species:** 112 species

**Category Breakdown:**

- Warblers: 22 species
- Waterfowl: 15 species
- Woodpeckers: 6 species
- Raptors: 7 species

### Step 3: Notable Species

**Forest Breeders:**

- Wood Thrush
- Ovenbird
- Scarlet Tanager

**River Species:**

- Belted Kingfisher
- Great Blue Heron
- Green Heron

### Step 4: Web Scraping Results

N/A - No website provided

### Step 5: Generated Description

```
A park along the Rappahannock River in Stafford County, Virginia, featuring mature riparian forest and river access.

Over 112 bird species recorded at this eBird hotspot, including 22 warbler species and 15 waterfowl species.

The riparian forest supports breeding Wood Thrush, Ovenbird, and Scarlet Tanager, along with summer populations of warblers. The river attracts Belted Kingfisher, Great Blue Heron, and Green Heron.

Woodpeckers are well-represented with 6 species including Pileated Woodpecker. Raptors include Bald Eagle, Osprey, and Red-shouldered Hawk.

Waterfowl are present during migration and winter months. Access via trails with parking available.
```

**Note:** Without website data, the description is simpler but still professional and informative based on eBird data alone.

---

## Example 5: Fallback Mode (No eBird Hotspots Found)

### Input Data

```javascript
{
    name: "Hidden Valley Preserve",
    lat: 38.123,
    lon: -77.654,
    county: "Fauquier",
    state: "VA",
    type: "preserve",
    website: "https://example.org/hidden-valley",
    amenities: ["trails"]
}
```

### Step 1: Find Nearby eBird Hotspots

**Result:** No hotspots found within 25km

### Step 2: Fallback Options

**Prompt user:**

```
No eBird hotspots were found near these coordinates. Would you like to:
1. Use regional sightings data for Fauquier County, VA instead
2. Manually enter eBird hotspot IDs if you know them
3. Create the location without eBird data (you can add a custom description)
```

**User Choice:** Option 3 - Custom description

### Step 3: Manual Description Entry

**Prompt user:**

```
Please provide a description for this location. Include:
- Size/acreage if known
- Primary habitat types (forest, wetland, grassland, etc.)
- Notable bird species observed
- Access information
```

**User Input:**

```
A 450-acre private preserve in the Piedmont region featuring mixed hardwood forest,
stream valleys, and meadows. Notable breeding birds include Wood Thrush, Scarlet Tanager,
Yellow-throated Vireo, and Pileated Woodpecker. Access by permission only.
```

### Step 4: Final Location Data

```javascript
{
    name: "Hidden Valley Preserve",
    description: "A 450-acre private preserve in the Piedmont region featuring mixed hardwood forest, stream valleys, and meadows. Notable breeding birds include Wood Thrush, Scarlet Tanager, Yellow-throated Vireo, and Pileated Woodpecker. Access by permission only.",
    lat: 38.123,
    lon: -77.654,
    county: "Fauquier",
    state: "VA",
    type: "preserve",
    website: "https://example.org/hidden-valley",
    amenities: ["trails"],
    ebirdHotspotIds: []  // Empty array
}
```

---

## Common Patterns Summary

### Pattern 1: Large Refuge/Preserve with High Diversity

- Lead with acreage and conservation significance
- Emphasize total species count as "premier destination"
- Highlight extraordinary category diversity (44+ shorebirds, etc.)
- List rare/threatened species prominently
- Dedicate paragraph per major category
- End with comprehensive facilities description

### Pattern 2: Medium-Sized Park with Moderate Diversity

- Lead with size and primary habitats
- State total species count with notable category counts
- Group species by breeding habitat
- Mention seasonal highlights (waterfowl in winter, etc.)
- Simple facilities summary

### Pattern 3: Small Park or Limited Data

- Brief location description
- Focus on most notable species
- Mention primary habitat and associated birds
- Keep facilities description simple
- Can still be professional and useful

### Pattern 4: No eBird Data Available

- Rely on web scraping and user input
- Focus on habitats and access
- Can still create useful entry
- Recommend user add eBird hotspot association later

## Quality Indicators

**High-Quality Generated Descriptions Include:**

- Specific species counts and categories
- Conservation-priority species highlighted
- Habitat-species relationships described
- Professional, varied sentence structure
- Comprehensive but not overwhelming

**Lower-Quality Descriptions (to avoid):**

- Generic statements ("many birds")
- Flat species lists without organization
- Missing habitat context
- Vague or repetitive language
- Too brief or too lengthy

## User Editing Examples

### Example Edit 1: Add Seasonal Context

**Generated:**

```
Waterfowl are abundant with 31 species including Tundra Swan, Canvasback, and Bufflehead.
```

**User Edit:**

```
Waterfowl are abundant in fall and winter, peaking in December and January with large rafts
of Canvasback and Bufflehead. Tundra Swan numbers can exceed 200 individuals.
```

### Example Edit 2: Add Local Access Details

**Generated:**

```
Access via designated trails with parking available.
```

**User Edit:**

```
Access via 3 miles of designated trails with parking at the main entrance off Route 218.
The preserve is open dawn to dusk year-round.
```

### Example Edit 3: Add Historical Context

**Generated:**

```
A 733-acre state park on the Rappahannock River in Lancaster County, Virginia.
```

**User Edit:**

```
A 733-acre state park on the Rappahannock River in Lancaster County, Virginia, established
in 1993 to protect the former Belle Isle plantation lands.
```

---

## Tips for Best Results

1. **Provide accurate coordinates** - Check that lat/lon are not reversed
2. **Associate multiple hotspots** - More hotspots = richer species data
3. **Include website URL** - Enables habitat context extraction
4. **Be specific with type** - "national wildlife refuge" vs just "refuge"
5. **Select all relevant amenities** - Helps birders plan visits
6. **Review and edit** - Add local knowledge and seasonal details
7. **Check species emphasis** - Ensure rare/priority species are highlighted

These examples demonstrate the full range of use cases from data-rich major refuges to simple local parks, and show how the skill adapts to available data while maintaining professional quality.
