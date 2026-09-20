# Species Categorization Guide

This guide provides the logic for grouping and categorizing bird species from eBird taxonomy data.

## Overview

Bird species from eBird taxonomy need to be categorized by family/group for generating descriptions. This categorization enables:

1. Counting species by category (e.g., "33 warbler species")
2. Organizing species in descriptions by logical groupings
3. Highlighting notable species within each category
4. Creating habitat-based paragraphs

## eBird Taxonomy Structure

eBird taxonomy data includes these key fields:

```javascript
{
    speciesCode: "string",      // e.g., "norbob"
    comName: "string",          // Common name, e.g., "Northern Bobwhite"
    sciName: "string",          // Scientific name, e.g., "Colinus virginianus"
    category: "string",         // e.g., "species", "issf", "hybrid"
    taxonOrder: number,         // Taxonomic order number
    familyCode: "string",       // Family code, e.g., "Odontophoridae"
    familyComName: "string",    // Family common name, e.g., "New World Quail"
    familySciName: "string",    // Family scientific name
    order: "string"             // Order name, e.g., "Galliformes"
}
```

## Primary Categories

### Major Bird Groups

Use these primary categories for description organization and statistics:

| Category          | Family Codes                                                 | Common Name                                         | Notes                                                              |
| ----------------- | ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------ |
| **Waterfowl**     | Anatidae                                                     | Ducks, Geese, and Swans                             | Includes all dabbling ducks, diving ducks, sea ducks, geese, swans |
| **Warblers**      | Parulidae                                                    | New World Warblers                                  | Highly diverse, peak during migration, many breeding species       |
| **Shorebirds**    | Charadriidae, Scolopacidae, Haematopodidae, Recurvirostridae | Plovers, Sandpipers, Oystercatchers, Stilts/Avocets | Migration hotspots, conservation significance                      |
| **Raptors**       | Accipitridae, Falconidae, Pandionidae, Cathartidae           | Hawks/Eagles, Falcons, Osprey, Vultures             | All diurnal raptors                                                |
| **Owls**          | Strigidae, Tytonidae                                         | Typical Owls, Barn Owls                             | Nocturnal raptors (separate from diurnal)                          |
| **Herons/Egrets** | Ardeidae                                                     | Herons, Egrets, and Bitterns                        | Wetland specialists                                                |
| **Rails**         | Rallidae                                                     | Rails, Gallinules, and Coots                        | Secretive marsh birds                                              |
| **Gulls/Terns**   | Laridae                                                      | Gulls, Terns, and Skimmers                          | Coastal and inland waterbirds                                      |
| **Woodpeckers**   | Picidae                                                      | Woodpeckers                                         | Forest specialists                                                 |
| **Flycatchers**   | Tyrannidae                                                   | Tyrant Flycatchers                                  | Diverse group, migration peaks                                     |
| **Sparrows**      | Passerellidae                                                | New World Sparrows                                  | Grassland/scrub specialists                                        |
| **Thrushes**      | Turdidae                                                     | Thrushes                                            | Includes robins, bluebirds                                         |
| **Vireos**        | Vireonidae                                                   | Vireos                                              | Forest songbirds                                                   |
| **Swallows**      | Hirundinidae                                                 | Swallows and Martins                                | Aerial insectivores                                                |

## Family Code Reference

### Complete List of Major Families

```javascript
const FAMILY_CATEGORIES = {
    // Waterfowl
    waterfowl: ['Anatidae'],

    // Warblers
    warblers: ['Parulidae'],

    // Shorebirds
    shorebirds: [
        'Charadriidae', // Plovers
        'Scolopacidae', // Sandpipers
        'Haematopodidae', // Oystercatchers
        'Recurvirostridae' // Stilts and Avocets
    ],

    // Raptors (diurnal)
    raptors: [
        'Accipitridae', // Hawks, Eagles, Kites
        'Falconidae', // Falcons
        'Pandionidae', // Osprey
        'Cathartidae' // New World Vultures
    ],

    // Owls (nocturnal raptors)
    owls: [
        'Strigidae', // Typical Owls
        'Tytonidae' // Barn Owls
    ],

    // Herons, Egrets, Bitterns
    herons: ['Ardeidae'],

    // Rails, Gallinules, Coots
    rails: ['Rallidae'],

    // Gulls, Terns, Skimmers
    gullsTerns: ['Laridae'],

    // Woodpeckers
    woodpeckers: ['Picidae'],

    // Flycatchers
    flycatchers: ['Tyrannidae'],

    // Sparrows
    sparrows: ['Passerellidae'],

    // Thrushes
    thrushes: ['Turdidae'],

    // Vireos
    vireos: ['Vireonidae'],

    // Swallows
    swallows: ['Hirundinidae'],

    // Additional significant families
    hummingbirds: ['Trochilidae'],
    cormorants: ['Phalacrocoracidae'],
    pelicans: ['Pelecanidae'],
    ibises: ['Threskiornithidae'],
    cranes: ['Gruidae'],
    kingfishers: ['Alcedinidae'],
    jays: ['Corvidae'],
    chickadees: ['Paridae'],
    nuthatches: ['Sittidae'],
    wrens: ['Troglodytidae'],
    finches: ['Fringillidae'],
    blackbirds: ['Icteridae']
};
```

## Categorization Logic

### Step 1: Load Taxonomy Data

```javascript
// Fetch full taxonomy (cache this for session)
const fullTaxonomy = (await fredbirds) - api_ebird_taxonomy_full();

// Create a lookup map for quick family resolution
const taxonomyMap = {};
fullTaxonomy.forEach((species) => {
    taxonomyMap[species.speciesCode] = species;
});
```

### Step 2: Categorize Species List

```javascript
function categorizeSpecies(speciesList, taxonomyMap) {
    const categories = {
        waterfowl: [],
        warblers: [],
        shorebirds: [],
        raptors: [],
        owls: [],
        herons: [],
        rails: [],
        gullsTerns: [],
        woodpeckers: [],
        flycatchers: [],
        sparrows: [],
        thrushes: [],
        vireos: [],
        swallows: [],
        hummingbirds: [],
        other: []
    };

    speciesList.forEach((speciesCode) => {
        const species = taxonomyMap[speciesCode];
        if (!species) return;

        const family = species.familyCode;

        // Categorize by family
        if (family === 'Anatidae') {
            categories.waterfowl.push(species);
        } else if (family === 'Parulidae') {
            categories.warblers.push(species);
        } else if (
            [
                'Charadriidae',
                'Scolopacidae',
                'Haematopodidae',
                'Recurvirostridae'
            ].includes(family)
        ) {
            categories.shorebirds.push(species);
        } else if (
            [
                'Accipitridae',
                'Falconidae',
                'Pandionidae',
                'Cathartidae'
            ].includes(family)
        ) {
            categories.raptors.push(species);
        } else if (['Strigidae', 'Tytonidae'].includes(family)) {
            categories.owls.push(species);
        } else if (family === 'Ardeidae') {
            categories.herons.push(species);
        } else if (family === 'Rallidae') {
            categories.rails.push(species);
        } else if (family === 'Laridae') {
            categories.gullsTerns.push(species);
        } else if (family === 'Picidae') {
            categories.woodpeckers.push(species);
        } else if (family === 'Tyrannidae') {
            categories.flycatchers.push(species);
        } else if (family === 'Passerellidae') {
            categories.sparrows.push(species);
        } else if (family === 'Turdidae') {
            categories.thrushes.push(species);
        } else if (family === 'Vireonidae') {
            categories.vireos.push(species);
        } else if (family === 'Hirundinidae') {
            categories.swallows.push(species);
        } else if (family === 'Trochilidae') {
            categories.hummingbirds.push(species);
        } else {
            categories.other.push(species);
        }
    });

    return categories;
}
```

### Step 3: Calculate Statistics

```javascript
function getCategoryStatistics(categories) {
    const stats = {};

    Object.keys(categories).forEach((category) => {
        stats[category] = categories[category].length;
    });

    // Calculate total unique species
    stats.total = Object.values(categories)
        .flat()
        .filter(
            (species, index, self) =>
                self.findIndex((s) => s.speciesCode === species.speciesCode) ===
                index
        ).length;

    return stats;
}
```

## Notable Species Identification

### Cross-Reference with Rare Birds List

```javascript
async function identifyNotableSpecies(speciesList, taxonomyMap) {
    // Get rare birds reference data
    const rareBirdsData =
        (await fredbirds) -
        api_reference_data_get({
            type: 'rarebirds'
        });

    const notableSpecies = {
        rare: [],
        threatened: [],
        conservationPriority: [],
        specialty: []
    };

    speciesList.forEach((speciesCode) => {
        const species = taxonomyMap[speciesCode];
        if (!species) return;

        // Check if rare
        const isRare = rareBirdsData.some(
            (rare) =>
                rare.speciesCode === speciesCode ||
                rare.comName === species.comName
        );

        if (isRare) {
            notableSpecies.rare.push(species);
        }

        // Check for conservation keywords in common name or notes
        // (This would need additional data source for full implementation)
        const conservationKeywords = [
            'threatened',
            'endangered',
            'concern',
            'Cerulean',
            'Prothonotary',
            'Golden-winged'
        ];

        if (
            conservationKeywords.some((keyword) =>
                species.comName.includes(keyword)
            )
        ) {
            notableSpecies.conservationPriority.push(species);
        }
    });

    return notableSpecies;
}
```

## Habitat Assignment

### Assign Species to Habitats

Based on family and species ecology, assign to habitat categories:

```javascript
const HABITAT_ASSIGNMENTS = {
    forest: [
        'Parulidae', // Warblers
        'Picidae', // Woodpeckers
        'Tyrannidae', // Flycatchers (many)
        'Vireonidae', // Vireos
        'Turdidae', // Thrushes
        'Paridae', // Chickadees
        'Sittidae', // Nuthatches
        'Troglodytidae' // Wrens (some)
    ],

    wetland: [
        'Ardeidae', // Herons/Egrets
        'Rallidae', // Rails
        'Anatidae', // Waterfowl (some)
        'Threskiornithidae' // Ibises
    ],

    shoreline: [
        'Laridae', // Gulls/Terns
        'Charadriidae', // Plovers
        'Scolopacidae', // Sandpipers
        'Phalacrocoracidae' // Cormorants
    ],

    openWater: [
        'Anatidae', // Waterfowl (diving ducks)
        'Gaviidae', // Loons
        'Podicipedidae' // Grebes
    ],

    grassland: [
        'Passerellidae', // Sparrows
        'Icteridae' // Blackbirds (some)
    ],

    aerial: [
        'Hirundinidae', // Swallows
        'Apodidae' // Swifts
    ]
};
```

## Conservation Priority Species

### Known Conservation-Priority Species

These species should be highlighted when present:

```javascript
const CONSERVATION_PRIORITY = {
    // Federally Threatened/Endangered
    federallyListed: [
        'Piping Plover',
        'Red Knot',
        'Roseate Tern',
        "Kirtland's Warbler",
        'Golden-cheeked Warbler'
    ],

    // Species of Regional Conservation Concern
    regionalConcern: [
        'Cerulean Warbler',
        'Golden-winged Warbler',
        'Prothonotary Warbler',
        'Kentucky Warbler',
        'Worm-eating Warbler',
        'Louisiana Waterthrush',
        'Black-throated Blue Warbler',
        'Canada Warbler',
        'American Woodcock',
        'King Rail',
        'Black Rail',
        'Yellow Rail',
        'Least Bittern',
        'American Bittern',
        'Saltmarsh Sparrow',
        'Seaside Sparrow',
        "Henslow's Sparrow",
        'Grasshopper Sparrow',
        'Eastern Whip-poor-will',
        "Chuck-will's-widow",
        'Red-headed Woodpecker',
        'Short-eared Owl',
        'Barn Owl'
    ],

    // Declining Grassland Birds
    grasslandSpecialists: [
        'Bobolink',
        'Eastern Meadowlark',
        'Field Sparrow',
        'Vesper Sparrow'
    ]
};
```

## Usage in Description Generation

### Priority for Highlighting

When generating descriptions, prioritize species in this order:

1. **Federally listed species** - Always mention first
2. **Regional conservation concern** - Group by habitat
3. **Rare/uncommon species** - From rare birds reference
4. **Specialty/sought-after** - Locally significant
5. **Common but notable** - Iconic species (Bald Eagle, Pileated Woodpecker)

### Example Implementation

```javascript
function organizeSpeciesForDescription(categories, notableSpecies) {
    const paragraphs = []

    // Conservation-priority breeders paragraph
    if (notableSpecies.conservationPriority.length > 0) {
        const breeders = notableSpecies.conservationPriority.filter(s =>
            // Filter for likely breeders (would need breeding data)
            categories.warblers.includes(s) ||
            categories.rails.includes(s)
        )

        if (breeders.length > 0) {
            paragraphs.push({
                type: 'conservation',
                intro: 'supports an exceptional suite of conservation-priority breeders:',
                species: breeders.map(s => s.comName)
            })
        }
    }

    // Habitat-specific paragraphs
    // (Group species by habitat and create paragraphs)

    // Category-specific paragraphs for large groups
    if (categories.raptors.length >= 5) {
        paragraphs.push({
            type: 'category',
            category: 'Raptors',
            count: categories.raptors.length,
            species: categories.raptors
                .sort((a, b) => /* sort by prominence */)
                .slice(0, 5)
                .map(s => s.comName)
        })
    }

    return paragraphs
}
```

## Category Count Thresholds

### When to Mention Category in Description

Use these thresholds to decide whether to highlight a category:

| Category      | Mention If Count >= | Example Phrasing                              |
| ------------- | ------------------- | --------------------------------------------- |
| Waterfowl     | 15                  | "24 waterfowl species"                        |
| Warblers      | 20                  | "33 warbler species"                          |
| Shorebirds    | 15                  | "44 shorebird species" (extraordinary if >30) |
| Raptors       | 5                   | "Raptors include..." (list notable species)   |
| Gulls/Terns   | 6                   | "9 gull and tern species including..."        |
| Rails         | 4                   | "8 rail species including the secretive..."   |
| Herons/Egrets | 6                   | "12 heron and egret species"                  |
| Woodpeckers   | 5                   | "All 7 expected [state] woodpecker species"   |

## Special Cases

### Regional Expectations

**Woodpeckers by Region:**

- Virginia: 7 expected species (Downy, Hairy, Red-bellied, Red-headed, Pileated, Northern Flicker, Yellow-bellied Sapsucker)
- Add Red-cockaded in suitable southeastern habitat

**Rails:**

- Secretive nature makes any rail notable
- Emphasize rare species: Black Rail, Yellow Rail, King Rail

**Owls:**

- Nocturnal, often underreported
- Any diversity is notable (>3 species)

### Seasonal Emphasis

If seasonal data is available (from eBird observations):

- **Winter waterfowl concentrations** - Mention if counts are high
- **Spring/fall migration peaks** - Warblers, shorebirds, thrushes
- **Breeding season** - Highlight breeding species
- **Year-round residents** - Note if location has good resident diversity

## Output Format

### Suggested Data Structure

```javascript
{
    statistics: {
        total: 205,
        waterfowl: 24,
        warblers: 33,
        shorebirds: 12,
        raptors: 8,
        // ... etc
    },

    notableSpecies: {
        conservationPriority: [
            { comName: 'Cerulean Warbler', familyCode: 'Parulidae', ... },
            { comName: 'Prothonotary Warbler', familyCode: 'Parulidae', ... }
        ],
        rare: [
            { comName: 'American White Pelican', familyCode: 'Pelecanidae', ... }
        ]
    },

    byHabitat: {
        forest: [...],
        wetland: [...],
        shoreline: [...]
    },

    byCategory: {
        waterfowl: [...],
        warblers: [...],
        shorebirds: [...]
    }
}
```

This structure enables flexible description generation based on available data and notable species presence.
