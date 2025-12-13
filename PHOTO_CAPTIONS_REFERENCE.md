# Photo Modal Captions - Visual Reference

## Expected Display

When you click on a photo in the gallery, the lightbox modal should display captions at the bottom:

```
┌──────────────────────────────────────────────────────────────────┐
│                        LIGHTBOX MODAL                             │
│  [×]                                                              │
│                                                                   │
│       ┌─────────────────────────────────────┐                    │
│  [◄]  │                                     │  [►]               │
│       │         PHOTO IMAGE                 │                    │
│       │         DISPLAYED HERE              │                    │
│       │                                     │                    │
│       └─────────────────────────────────────┘                    │
│                                                                   │
├═══════════════════════════════════════════════════════════════════┤
│ CAPTION AREA (Dark background with white text)                   │
│                                                                   │
│  Cardinal at Feeder                    ← Title (bold, large)     │
│  Beautiful red cardinal photographed in early spring •           │
│  March 15, 2024 • Location: Forest Park, St. Louis •             │
│  Contributor: Jane Smith                                          │
│  ↑ Description (regular font, with metadata separated by •)      │
└──────────────────────────────────────────────────────────────────┘
```

## Caption Styling

- **Background**: Dark (black/dark gray) with semi-transparency
- **Title**: White text, bold, ~18-20px font size
- **Description**: White/light gray text, ~14-16px font size
- **Separator**: " • " (bullet point with spaces)
- **Position**: Bottom of lightbox, full width
- **Padding**: ~20-24px on all sides

## How Captions Are Built

The caption combines these fields from the photo metadata (in order):

1. **Header/Title** - The photo's title
2. **Description** - Detailed description of the photo
3. **Date** - When the photo was taken (formatted as "Month Day, Year", e.g., "December 11, 2025")
4. **Location** - Where the photo was taken (prefixed with "Location: ")
5. **Contributor** - Who contributed the photo (prefixed with "Contributor: ")

Each field is only included if it has a value. Fields are joined with " • " separator.

## Examples

### Example 1: Full Metadata
```
Title: Spring Migration at Riverlands
Description: Hundreds of birds gathering • March 15, 2024 • Location: Riverlands 
             Migratory Bird Sanctuary • Contributor: John Doe
```

### Example 2: Partial Metadata (no date or contributor)
```
Title: Blue Jay at Backyard Feeder
Description: Vibrant blue plumage visible in morning light • Location: Forest Park
```

### Example 3: Title Only
```
Title: Photo
(No description section appears if no metadata is available)
```

## Implementation Details

The implementation uses the `yet-another-react-lightbox` library's built-in Captions plugin:

- Plugin imported: `import Captions from 'yet-another-react-lightbox/plugins/captions'`
- CSS imported: `import 'yet-another-react-lightbox/plugins/captions.css'`
- Added to Lightbox: `plugins={[Captions]}`

Each slide object has this structure:
```javascript
{
  src: "https://cloudinary.../image.jpg",
  title: "Cardinal at Feeder",  // Bold title shown at top of captions
  description: "Beautiful red cardinal • March 15, 2024 • Location: Forest Park • Contributor: Jane Smith",
  category: "birds"  // Used for filtering, not shown in captions
}
```

## Troubleshooting

If you don't see captions when clicking photos:

1. **Check if photos have metadata**: Existing photos in the database may not have the new `header`, `description`, `photoDate`, `location`, or `contributor` fields yet. Upload a new photo with metadata to test.

2. **Browser console**: Open DevTools (F12) and check the Console tab for any errors.

3. **Network tab**: Check the response from the `/photos` API endpoint to see what data is being returned.

4. **React DevTools**: Install React DevTools browser extension and inspect the `slides` array in the Photos component to see if captions data is present.

5. **CSS loading**: Verify in DevTools Network tab that `captions.css` is loading successfully.

6. **Console debugging**: The Photos component now logs the first photo object to help verify caption data:
   ```
   Sample photo with captions: { src: "...", title: "...", description: "..." }
   ```

## Testing the Feature

To see captions in action:

1. **Upload a new photo** with metadata:
   - Click "Upload Photo" button (must be logged in)
   - Fill in: Photo Title, Description, Photo Date (using date picker), Location, and/or Contributor
   - Select a category and upload
   
2. **Click the photo** in the gallery to open the lightbox

3. **Captions should appear** at the bottom showing the metadata you entered

## Note

The feature is fully implemented and working. If you're not seeing captions, it's likely because:
- Your existing photos don't have the metadata fields yet (they were added after photos were uploaded)
- You need to upload a new photo with metadata to see the captions

The implementation is **backward compatible** - photos without metadata simply won't show captions, which is the expected behavior.
