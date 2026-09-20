# Description Template Guide

This guide provides templates and patterns for generating comprehensive birding location descriptions.

## Overall Structure

```
[INTRO PARAGRAPH]
- Size/acreage (from web)
- Geographic location/features
- Primary habitat types
- Optional: Conservation/historical context

[SPECIES STATISTICS PARAGRAPH]
- Total species count
- Number of eBird hotspots
- Notable category counts (warblers, waterfowl, etc.)

[NOTABLE SPECIES PARAGRAPHS] (2-4 paragraphs)
- Organized by habitat, season, or category
- Highlight conservation-priority species
- Group related species together
- Lead with most significant/rare species

[FACILITIES PARAGRAPH]
- Access information
- Available amenities
```

## Template Variables

### From User Input

- `{name}` - Location name
- `{county}` - County name
- `{state}` - State code
- `{type}` - Location type (preserve, refuge, park, etc.)
- `{amenities}` - Array of amenity strings
- `{website}` - Official website URL

### From Web Scraping

- `{acreage}` - Size in acres (e.g., "3,115-acre", "733-acre")
- `{habitats}` - Array of habitat types
- `{geographicFeature}` - Peninsula, river, bay, etc.
- `{conservationContext}` - Historical or conservation significance

### From eBird Data

- `{totalSpecies}` - Total unique species count
- `{hotspotCount}` - Number of associated eBird hotspots
- `{categoryCount.warblers}` - Count of warbler species
- `{categoryCount.waterfowl}` - Count of waterfowl species
- `{categoryCount.shorebirds}` - Count of shorebird species
- `{categoryCount.raptors}` - Count of raptor species
- `{categoryCount.herons}` - Count of heron/egret species
- `{categoryCount.gulls}` - Count of gull/tern species
- `{categoryCount.woodpeckers}` - Count of woodpecker species

### From Species Analysis

- `{notableSpecies.breeders}` - Conservation-priority breeding species
- `{notableSpecies.rare}` - Rare or threatened species
- `{notableSpecies.specialty}` - Sought-after specialty birds
- `{speciesByHabitat.forest}` - Forest species list
- `{speciesByHabitat.marsh}` - Marsh/wetland species list
- `{speciesByHabitat.water}` - Water/shoreline species list

## Paragraph Templates

### 1. Opening Paragraph

**Pattern A: With Acreage and Geographic Feature**

```
A {acreage} {type} {on/in} {geographicFeature} in {county} County, {state}, {habitat description}. {conservationContext if available}.
```

**Example:**

```
A 3,115-acre wilderness preserve on the Crow's Nest Peninsula in Stafford County, where mature hardwood ravines meet freshwater tidal marshes along the Potomac and Accokeek Creeks. One of the finest upland hardwood forests remaining in the Virginia Coastal Plain.
```

**Pattern B: Without Acreage**

```
A {type} in {county} County, {state}, featuring {primary habitats}. {Additional context}.
```

**Example:**

```
A national wildlife refuge in Kent County, Delaware, featuring tidal salt marsh, freshwater impoundments, upland fields, and woodland. Established in 1937 for migratory waterfowl on the Atlantic Flyway.
```

**Pattern C: Simple Format**

```
{Description of location and habitats} in {county} County, {state}.
```

### 2. Species Statistics Paragraph

**Pattern A: With Category Breakdowns**

```
Over {totalSpecies} bird species recorded across {hotspotCount} eBird hotspot[s], including {categoryCount.warblers} warbler species and {categoryCount.waterfowl} waterfowl.
```

**Example:**

```
Over 205 bird species recorded across 2 eBird hotspots, including 33 warbler species and 24 waterfowl.
```

**Pattern B: Emphasizing Diversity**

```
Over {totalSpecies} bird species recorded across {hotspotCount} eBird hotspot[s], making it one of the premier birding destinations {in/for} {region/feature}.
```

**Example:**

```
Over 340 bird species recorded across 2 eBird hotspots, making it one of the premier birding destinations on the Atlantic Coast.
```

**Pattern C: With Multiple Categories**

```
Over {totalSpecies} bird species recorded across {hotspotCount} eBird hotspot[s]. {Category name} diversity is {descriptor} with {count} species including {examples}.
```

**Example:**

```
Over 340 bird species recorded across 2 eBird hotspots. Shorebird diversity is extraordinary with 44 species including the globally threatened Red Knot, federally threatened Piping Plover, and rare vagrants such as Curlew Sandpiper.
```

### 3. Notable Species Paragraphs

**Pattern A: By Habitat Type**

```
The {habitat description} {support/harbor/host} {descriptor} suite of {category}: {species list with notable species emphasized}.
```

**Examples:**

```
The steep forested ravines support an exceptional suite of conservation-priority breeders: Cerulean Warbler, Prothonotary Warbler, Worm-eating Warbler, Kentucky Warbler, and Louisiana Waterthrush.

The freshwater tidal marshes harbor King Rail, Least Bittern, American Bittern, and Marsh Wren.
```

**Pattern B: By Taxonomy Category**

```
{Category plural} {include/number} {count} species {with/including} {notable examples}.
```

**Examples:**

```
Raptors include Bald Eagle, Osprey, Peregrine Falcon, Barred Owl, and American Barn Owl.

Waterfowl are equally impressive at 44 species, highlighted by large Snow Goose concentrations in fall and winter, plus uncommon visitors like Pink-footed Goose, Garganey, and Eurasian Wigeon.
```

**Pattern C: By Geographic Feature**

```
The {feature} {attracts/draws} {count} {category} species including {examples}.
```

**Example:**

```
The Potomac frontage draws 9 gull and tern species including Royal Tern and Caspian Tern, plus American White Pelican.
```

**Pattern D: Comprehensive Category Statement**

```
All {expected count} expected {region} {category} species are present, led by {most common examples}.
```

**Example:**

```
All 7 expected Virginia woodpecker species are present, led by Pileated and Red-headed Woodpecker.
```

**Pattern E: Seasonal Emphasis**

```
{Category plural} {are abundant/peak} in {season}, with {notable occurrences or counts}.
```

**Example:**

```
Waterfowl are abundant in fall and winter, with large concentrations of Tundra Swan, Canvasback, and Bufflehead.
```

### 4. Facilities Paragraph

**Pattern A: With Limitations**

```
Access {is limited to/via} {access details}; {facilities summary}.
```

**Example:**

```
Access is limited to designated trails; no facilities beyond parking and trail access.
```

**Pattern B: With Full Amenities**

```
{Facilities list} {available/accessible}, including {highlighted features}.
```

**Example:**

```
Includes a 12-mile auto tour route with observation towers and a visitor center.
```

**Pattern C: Simple List**

```
Access via designated trails with {amenity list} available.
```

**Example:**

```
Access via designated trails with parking, restrooms, boat ramp, and fishing pier available.
```

## Species List Formatting

### Emphasis Patterns

**Conservation Priority (use first)**

- "an exceptional suite of conservation-priority breeders:"
- "globally threatened [species]"
- "federally threatened [species]"
- "species of concern"

**Rarity/Specialty**

- "rare vagrants such as"
- "uncommon visitors like"
- "specialty birds"
- "sought-after species"

**Abundance**

- "large concentrations of"
- "abundant populations of"
- "impressive numbers of"

### Species Ordering

Within a list, order by:

1. Conservation status (threatened first)
2. Rarity (rarest first)
3. Prominence (most iconic/sought-after)
4. Alphabetical (if equal weight)

### Examples

**Conservation Priority:**

```
Cerulean Warbler, Prothonotary Warbler, Worm-eating Warbler, Kentucky Warbler, and Louisiana Waterthrush
```

(All are species of conservation concern)

**Mixed Prominence:**

```
Bald Eagle, Osprey, Peregrine Falcon, Barred Owl, and American Barn Owl
```

(Ordered by prominence/iconic status)

**Rare Vagrants:**

```
Curlew Sandpiper, Little Stint, Sharp-tailed Sandpiper, and Northern Lapwing
```

(All rare, ordered by occurrence frequency)

## Category-Specific Patterns

### Warblers

**Breeding Warblers:**

```
The {habitat} supports {descriptor} breeding warblers including {species list}.
```

**Migration Warblers:**

```
Warblers total {count} species, with peak diversity during spring migration.
```

### Waterfowl

**Winter Concentrations:**

```
Waterfowl are {abundant/impressive} at {count} species, highlighted by {seasonal occurrence} concentrations of {common species}, plus {rare/uncommon} visitors like {examples}.
```

**Diversity Emphasis:**

```
{Count} waterfowl species include {notable examples}.
```

### Raptors

**Resident and Seasonal:**

```
Raptors {number/include} {count} species with {resident species}, {seasonal visitors}, and {uncommon species}.
```

**Simple List:**

```
Raptors include {species list}.
```

### Shorebirds

**Migration Emphasis:**

```
Shorebird diversity {peaks/is exceptional} during {season} migration with {count} species including {notable examples}.
```

**Rare Species Emphasis:**

```
Shorebird diversity is {descriptor} with {count} species including the {conservation status} {species}, and rare vagrants such as {examples}.
```

### Herons/Egrets/Rails

**Wetland Specialists:**

```
The {wetland type} {harbors/supports} {count} {category} species including {secretive/rare species emphasis}.
```

**Example:**

```
The marshes support 12 heron and egret species, 8 rail species including the secretive Yellow Rail, and 4 ibis species including Roseate Spoonbill.
```

### Woodpeckers

**Complete Suite:**

```
All {count} expected {region} woodpecker species are present, led by {most common}.
```

**Diversity:**

```
{Count} woodpecker species include {notable examples}.
```

## Habitat Descriptors

### Forest/Woodland

- "mature hardwood ravines"
- "steep forested ravines"
- "upland hardwood forests"
- "forested uplands"
- "oak-hickory forest"
- "riparian woodland"

### Wetland/Marsh

- "freshwater tidal marshes"
- "tidal salt marsh"
- "freshwater impoundments"
- "emergent wetlands"
- "cattail marshes"

### Water Features

- "Potomac frontage"
- "riverfront"
- "bay shoreline"
- "tidal creeks"
- "river confluence"

### Open Areas

- "upland fields"
- "grasslands"
- "meadows"
- "agricultural fields"

### Coastal

- "sandy beaches"
- "dunes"
- "barrier islands"
- "coastal scrub"

## Complete Example Breakdowns

### Example 1: Crow's Nest Natural Area Preserve

**Data Available:**

- Acreage: 3,115 acres
- Location: Crow's Nest Peninsula, Stafford County, VA
- Habitats: hardwood ravines, freshwater tidal marshes
- Water features: Potomac and Accokeek Creeks
- Conservation: Virginia Coastal Plain significance
- Species: 205 total, 33 warblers, 24 waterfowl, 2 hotspots

**Generated Description:**

```
A 3,115-acre wilderness preserve on the Crow's Nest Peninsula in Stafford County, where mature hardwood ravines meet freshwater tidal marshes along the Potomac and Accokeek Creeks. One of the finest upland hardwood forests remaining in the Virginia Coastal Plain.

Over 205 bird species recorded across two eBird hotspots, including 33 warbler species and 24 waterfowl.

The steep forested ravines support an exceptional suite of conservation-priority breeders: Cerulean Warbler, Prothonotary Warbler, Worm-eating Warbler, Kentucky Warbler, and Louisiana Waterthrush. The freshwater tidal marshes harbor King Rail, Least Bittern, American Bittern, and Marsh Wren.

Raptors include Bald Eagle, Osprey, Peregrine Falcon, Barred Owl, and American Barn Owl. The Potomac frontage draws 9 gull and tern species including Royal Tern and Caspian Tern, plus American White Pelican.

All 7 expected Virginia woodpecker species are present, led by Pileated and Red-headed Woodpecker. Access is limited to designated trails; no facilities beyond parking and trail access.
```

### Example 2: Bombay Hook National Wildlife Refuge

**Data Available:**

- Acreage: 15,978 acres
- Location: Delaware Bay, Kent County, DE
- Established: 1937, Atlantic Flyway importance
- Habitats: tidal salt marsh, freshwater impoundments, upland fields, woodland
- Species: 340+ total, extraordinary diversity, 2 hotspots
- Amenities: 12-mile auto tour, observation towers, visitor center

**Generated Description:**

```
A 15,978-acre national wildlife refuge along Delaware Bay, established in 1937 for migratory waterfowl on the Atlantic Flyway. Features tidal salt marsh, freshwater impoundments, upland fields, and woodland.

Over 340 bird species recorded across two eBird hotspots, making it one of the premier birding destinations on the Atlantic Coast.

Shorebird diversity is extraordinary with 44 species including the globally threatened Red Knot, federally threatened Piping Plover, and rare vagrants such as Curlew Sandpiper, Little Stint, Sharp-tailed Sandpiper, and Northern Lapwing.

Waterfowl are equally impressive at 44 species, highlighted by large Snow Goose concentrations in fall and winter, plus uncommon visitors like Pink-footed Goose, Garganey, and Eurasian Wigeon.

The marshes support 12 heron and egret species, 8 rail species including the secretive Yellow Rail, and 4 ibis species including Roseate Spoonbill. Raptors number 26 species with Bald Eagle, Golden Eagle, Snowy Owl, Short-eared Owl, and Rough-legged Hawk among the highlights. Warblers total 36 species.

Includes a 12-mile auto tour route with observation towers and a visitor center.
```

## Generation Logic

### Step-by-Step Process

1. **Build opening paragraph:**
    - Use acreage if available from web scraping
    - Include geographic feature if identified
    - Add habitat description (from web or categorized from species data)
    - Append conservation context if found

2. **Add statistics paragraph:**
    - Always include total species count and hotspot count
    - Add category breakdowns if counts are notable (>20 species)
    - Use superlative language if counts are exceptional

3. **Generate notable species paragraphs:**
    - Start with conservation-priority breeding species (if any)
    - Group by habitat type or taxonomy category
    - Aim for 2-4 paragraphs depending on diversity
    - Order paragraphs by habitat prominence or species significance

4. **Add facilities paragraph:**
    - Summarize amenities array
    - Mention access restrictions if applicable
    - Highlight special features (auto tour, towers, etc.)

### Decision Tree for Species Paragraphs

```
IF conservation-priority breeders exist:
    Create paragraph highlighting these first
    Group by breeding habitat

IF multiple distinct habitats identified:
    Create paragraph per major habitat
    Assign species to habitats based on ecology

ELSE:
    Create paragraphs by taxonomy category
    Order categories by species count or significance

FOR each category with >10 species:
    Create dedicated paragraph or sentence
    Highlight most notable species

FOR specialty/rare species:
    Create paragraph or append to relevant section
    Use emphatic language (extraordinary, rare, etc.)
```

## Quality Checklist

**A good description includes:**

- [ ] Location context (county, state, size if available)
- [ ] Habitat types
- [ ] Total species count with category breakdowns
- [ ] Notable or conservation-priority species highlighted
- [ ] Organized by habitat or category (not random list)
- [ ] Facilities/access information
- [ ] Professional, descriptive language
- [ ] Varied sentence structure
- [ ] Specific examples (species names, counts)

**Avoid:**

- Generic descriptions without specific species
- Flat lists without organization
- Missing context about habitats
- Technical jargon (use common names)
- Repetitive sentence structure
- Vague language ("many birds", "various species")
