# Backend API Implementation Requirements

This document outlines the backend API endpoints needed for the event management system. The frontend is already built and expects these endpoints to handle creating, updating, and deleting events with new fields for trip leaders and multiple locations.

## Required Endpoints

1. **POST /events** - Create a new event
2. **PATCH /events/:id** - Update an existing event
3. **DELETE /events/:id** - Delete an event

## Event Data Schema

The events should support the following structure:

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  event: String,                    // Event title (required)
  start: Date,                      // Start date in ISO format (required)
  end: Date,                        // End date in ISO format (optional)
  details: String,                  // Event description (optional)
  cancelled: Boolean,               // Cancelled status (default: false)
  pdfFile: String,                  // URL to PDF file (optional)

  // NEW FIELD: Trip Leader
  tripLeader: {
    memberId: String,               // Reference to member _id
    email: String,
    firstName: String,
    lastName: String,
    name: String                    // Full name for display
  },                                // Optional - can be null

  // NEW FIELD: Multiple Locations (replaces single lat/lon)
  locations: [
    {
      name: String,                 // Location name/description (optional)
      lat: Number,                  // Latitude (required)
      lon: Number,                  // Longitude (required)
      address: String               // Full address (optional)
    }
  ],                                // Array - at least one location required

  // Existing fields to maintain
  attendees: [                      // Embedded attendance array
    {
      memberId: String,
      email: String,
      firstName: String,
      lastName: String,
      eventTitle: String,
      eventStart: Date,
      eventEnd: Date
    }
  ],
  attendeeCount: Number,            // Cached count
  participants: Array,              // Legacy field - keep for compatibility
  species_sighted: Array            // Legacy field - keep for compatibility
}
```

## API Endpoint Specifications

### POST /events

**Purpose:** Create a new event

**Request Body:** Event data (see schema above)

**Validation:**
- `event` (title) is required
- `start` date is required
- `locations` array must have at least one location with valid lat/lon
- If `end` date provided, must be >= `start` date
- If `tripLeader` provided, validate that memberId exists in members collection

**Response:**
- **201 Created** - Return the created event object with generated `_id`
- **400 Bad Request** - Return validation errors
- **500 Internal Server Error** - Database errors

### PATCH /events/:id

**Purpose:** Update an existing event

**Request Body:** Partial or complete event data

**Validation:** Same as POST, but all fields are optional

**Special Handling:**
- Preserve existing `attendees` array unless explicitly modified
- Update `attendeeCount` if attendees changed
- Validate event exists before updating

**Response:**
- **200 OK** - Return updated event object
- **404 Not Found** - Event ID doesn't exist
- **400 Bad Request** - Validation errors
- **500 Internal Server Error** - Database errors

### DELETE /events/:id

**Purpose:** Delete an event

**Special Considerations:**
- Consider if you want to prevent deletion of events with attendees (or warn)
- Alternatively, cascade delete all attendance records

**Response:**
- **200 OK** - Return success message and deleted event data
- **404 Not Found** - Event ID doesn't exist
- **500 Internal Server Error** - Database errors

## Migration Considerations

**Existing events** have a single `lat` and `lon` field. The frontend handles backward compatibility by converting old events to the new format:

```javascript
// Old format
{ lat: 37.7889, lon: -76.6447 }

// Converted to new format by frontend
{ locations: [{ lat: 37.7889, lon: -76.6447, name: '', address: '' }] }
```

**Backend should:**
- Accept both old format (lat/lon) and new format (locations array)
- Store new events with `locations` array
- Optionally migrate existing events in database from lat/lon to locations array

## Implementation Notes

1. **Database:** MongoDB (existing connection via RestDB or MongoDB Atlas)
2. **Existing API base URL:** `https://fredbirds-api.herokuapp.com/`
3. **Authentication:** May need officer-level authentication middleware
4. **CORS:** Ensure endpoints accept requests from the frontend domain
5. **Error Handling:** Return consistent error format with messages

## Example Request/Response

### Create Event Example

**Request:**
```http
POST /events
Content-Type: application/json

{
  "event": "Spring Migration at Belle Isle",
  "start": "2025-05-15T10:00:00.000Z",
  "end": "2025-05-15T15:00:00.000Z",
  "details": "Join us for a spring birding walk at Belle Isle State Park. Meet at the main parking lot at 10 AM. Bring binoculars and field guides.",
  "tripLeader": {
    "memberId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "name": "John Smith"
  },
  "locations": [
    {
      "name": "Belle Isle State Park - Main Parking",
      "lat": 37.7889,
      "lon": -76.6447,
      "address": "1632 Belle Isle Rd, Lancaster, VA 22503"
    },
    {
      "name": "Woodland Trail",
      "lat": 37.7923,
      "lon": -76.6512,
      "address": ""
    }
  ],
  "cancelled": false,
  "pdfFile": ""
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "_id": "507f1f77bcf86cd799439012",
  "event": "Spring Migration at Belle Isle",
  "start": "2025-05-15T10:00:00.000Z",
  "end": "2025-05-15T15:00:00.000Z",
  "details": "Join us for a spring birding walk at Belle Isle State Park...",
  "tripLeader": {
    "memberId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "name": "John Smith"
  },
  "locations": [
    {
      "name": "Belle Isle State Park - Main Parking",
      "lat": 37.7889,
      "lon": -76.6447,
      "address": "1632 Belle Isle Rd, Lancaster, VA 22503"
    },
    {
      "name": "Woodland Trail",
      "lat": 37.7923,
      "lon": -76.6512,
      "address": ""
    }
  ],
  "cancelled": false,
  "pdfFile": "",
  "attendees": [],
  "attendeeCount": 0
}
```

## Testing Checklist

- [ ] Create event with required fields only
- [ ] Create event with all optional fields
- [ ] Create event with multiple locations
- [ ] Create event with trip leader
- [ ] Update event (partial update)
- [ ] Update event (full replacement)
- [ ] Delete event with no attendees
- [ ] Delete event with attendees
- [ ] Validate error handling (missing required fields, invalid dates, etc.)
- [ ] Test backward compatibility with old lat/lon format

## Frontend Integration

The frontend expects the following behavior:

1. **Date Format:** All dates should be in ISO 8601 format (e.g., `2025-05-15T10:00:00.000Z`)
2. **Error Messages:** Return descriptive error messages in the response body
3. **CORS:** Allow requests from the frontend domain with appropriate headers
4. **Authentication:** Endpoints should validate that the user has OFFICER level access

## Related Files

Frontend implementation files:
- `src/components/ManageEventsDialog.jsx` - Main event management dialog
- `src/components/EventForm.jsx` - Event creation/editing form
- `src/components/EventList.jsx` - Event list and management
- `src/components/LocationsManager.jsx` - Multiple locations management
- `src/services/restdbService.js` - API service layer (lines 306-323)
