# fredbirds-api-client Skill

## Description

OpenCode skill for working with **fredbirds-api** service functions in the React app.

**Use this skill when:**

- Adding new API endpoint functions to `src/services/restdbService.js`
- Adding new eBird-specific functions to `src/services/ebirdService.js`
- Modifying existing API service functions
- Understanding request/response shapes for fredbirds-api endpoints
- Applying proper validation to API requests

**What this skill knows:**

- All 62 fredbirds-api endpoints with full specifications
- Two service patterns: restdbService (CRUD) and ebirdService (eBird-specific)
- Request/response validation rules
- Error handling approaches
- Real code examples from your existing services

---

## Service Architecture

The React app has **two service files** that interact with fredbirds-api:

### 1. restdbService.js - General CRUD Operations

**Pattern:** Functional with shared helper functions for GET/POST/PATCH/DELETE

**Base API URL:**

```javascript
const api = 'https://fredbirds-api.azurewebsites.net/';
```

**Shared Helper Functions:**

- `get(url)` - GET requests with JSON response validation
- `post(url, body)` - POST requests with JSON body
- `patch(url, body)` - PATCH requests with JSON body (auto-stringifies)
- DELETE - inline `fetch()` calls (no shared helper)

**Error Handling:**

```javascript
// Helpers throw on !res.ok
throw new Error(`HTTP ${res.status}: ${res.statusText}`);
```

**Used for:** Events, Members, Announcements, Photos, Reference Data

---

### 2. ebirdService.js - eBird-Specific Operations

**Pattern:** Functional with a single `callout()` helper for all requests

**Base API URL:**

```javascript
const api = 'https://fredbirds-api.azurewebsites.net/';
```

**Shared Helper Function:**

```javascript
const callout = async (url) => {
    try {
        const res = await fetch(url, { method: 'GET' });
        return res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};
```

**Error Handling:**

- Catches and logs fetch errors
- Re-throws errors for caller to handle

**Parameter Pattern:**

- Uses object destructuring with defaults: `{ lat, long, dist = 50, daysBack = 7 }`
- Note: Uses `long` (not `lng`) to match eBird API convention

**Used for:** eBird sightings, hotspots, regions, taxonomy

---

## Naming Conventions

### restdbService.js Conventions

#### GET Endpoints

Pattern: `get<Resource>` or `get<Resource>By<Filter>`

**Examples:**

- `getEventsByYear(year)`
- `getFutureEvents(currentDate, months)`
- `getAnnouncements()`
- `getMemberByEmail(email)`
- `getActiveMembers()`
- `getEventAttendees(eventId)`

#### POST Endpoints

Pattern: `save<Resource>` or `create<Resource>` or descriptive action

**Examples:**

- `saveMember(memberJson)`
- `savePhoto(photoData)`
- `createEvent(eventData)`
- `createAnnouncement(announcementData)`
- `registerForEvent(eventId, memberData)`
- `autoRegisterMember(auth0User)`

#### PATCH Endpoints

Pattern: `update<Resource>` or `patch<Resource>`

**Examples:**

- `updateMember(memberId, memberData)`
- `patchMember(memberId, updates)`
- `updateEvent(eventId, eventData)`
- `updateAnnouncement(announcementId, announcementData)`

#### DELETE Endpoints

Pattern: `delete<Resource>` or descriptive action

**Examples:**

- `deleteEvent(eventId)`
- `deleteAnnouncement(announcementId)`
- `unregisterFromEvent(eventId, memberId)`
- `removeEventPhoto(eventId, photoId)`

---

### ebirdService.js Conventions

#### All eBird Functions

Pattern: `get<Resource>` with descriptive names, object parameter with defaults

**Examples:**

- `getRegions()` - no parameters
- `getNearbyNotableObservations({ lat, long, dist = 50, daysBack = 7 })`
- `getHotspotDetails(locId)` - simple parameter
- `getSpeciesDetailsByLocation(locId)`
- `getNearbyObservations({ lat, long, dist = 5, daysBack = 7 })`
- `getNotableSightingsByLocation({ regionCode, daysBack = 14 })`
- `getNearbyHotspots({ lat, long, dist = 50 })`

**Parameter Pattern:**

- Use object destructuring for multiple params: `{ lat, long, dist, daysBack }`
- Provide sensible defaults: `dist = 50`, `daysBack = 7`
- Use `long` (not `lng`) - matches eBird API convention
- Simple single params don't need object: `locId`, `regionCode`

---

## URL Construction Patterns

### restdbService.js URL Patterns

#### Simple Path

```javascript
const url = `${api}events`;
const url = `${api}announcements`;
```

#### Path with Parameter

```javascript
const url = `${api}events/${eventId}`;
const url = `${api}members/${memberId}`;
```

#### Single Query Parameter

```javascript
const url = `${api}members/email?email=${encodeURIComponent(email)}`;
```

#### Multiple Query Parameters

```javascript
const url = `${api}members/filter?first=${member.first}&last=${member.last}&email=${member.email}`;
```

#### Nested Resources

```javascript
const url = `${api}events/${eventId}/attendees`;
const url = `${api}events/${eventId}/photos`;
const url = `${api}events/${eventId}/attendees/${memberId}`;
```

---

### ebirdService.js URL Patterns

#### Simple Path

```javascript
const url = `${api}regions/US`;
```

#### Path with Parameter

```javascript
const url = `${api}hotspots/${locId}/details`;
const url = `${api}hotspots/${locId}/species`;
const url = `${api}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
```

#### Query Parameters with Destructured Object

```javascript
// Pattern: destructure params, build query string inline
export const getNearbyNotableObservations = async ({
    lat,
    long,
    dist = 50,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
    return callout(url);
};
```

**Note:** API uses `lng` but parameter is named `long` - URL template handles the conversion

---

## Request Body Patterns

### Using post() Helper

**Note:** Some calls stringify, some pass pre-stringified JSON - be consistent with surrounding code.

```javascript
// Pattern 1: pre-stringify
return post(url, JSON.stringify(data));

// Pattern 2: pass raw (less common)
return post(url, memberJson);
```

### Using patch() Helper

The `patch()` helper **always stringifies internally**, so pass raw objects:

```javascript
return patch(url, updates); // helper will JSON.stringify
```

### Inline DELETE with Body

```javascript
const res = await fetch(url, {
    method: 'DELETE',
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    },
    body: JSON.stringify({ _id: photoId })
});
if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
return res.json();
```

### Inline DELETE without Body

```javascript
const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
return res.json();
```

---

## Code Examples from Existing Service

### GET Examples

**Simple GET:**

```javascript
export const getAnnouncements = async () => {
    const url = `${api}announcements`;
    return get(url);
};
```

**GET with path parameter:**

```javascript
export const getEventsByYear = async (year) => {
    const url = `${api}events/${year}`;
    return get(url);
};
```

**GET with query parameter:**

```javascript
export const getMemberByEmail = async (email) => {
    const url = `${api}members/email?email=${encodeURIComponent(email)}`;
    return get(url);
};
```

**GET with multiple query params:**

```javascript
export const getMember = async (member) => {
    const url = `${api}members/filter?first=${member.first}&last=${member.last}&email=${member.email}`;
    return get(url);
};
```

**GET nested resource:**

```javascript
export const getEventAttendees = async (eventId) => {
    const url = `${api}events/${eventId}/attendees`;
    return get(url);
};
```

### POST Examples

**Simple POST:**

```javascript
export const saveMember = async (memberJson) => {
    const url = `${api}members`;
    return post(url, memberJson);
};
```

**POST with JSON.stringify:**

```javascript
export const createEvent = async (eventData) => {
    const url = `${api}events`;
    return post(url, JSON.stringify(eventData));
};
```

**POST with object transformation:**

```javascript
export const savePhoto = async (photoData) => {
    const url = `${api}photos`;
    return post(
        url,
        JSON.stringify({
            cloudinary_public_id: photoData.publicId,
            header: photoData.title,
            description: photoData.description,
            location: photoData.location,
            contributor: photoData.contributor,
            photoDate: photoData.photoDate,
            category: photoData.category
        })
    );
};
```

**POST to nested resource:**

```javascript
export const registerForEvent = async (eventId, memberData) => {
    const url = `${api}events/${eventId}/attendees`;
    const body = JSON.stringify({
        memberId: memberData.memberId,
        email: memberData.email,
        firstName: memberData.firstName,
        lastName: memberData.lastName
    });
    return post(url, body);
};
```

### PATCH Examples

```javascript
export const updateEvent = async (eventId, eventData) => {
    const url = `${api}events/${eventId}`;
    return patch(url, eventData);
};

export const patchMember = async (memberId, updates) => {
    const url = `${api}members/${memberId}`;
    return patch(url, updates);
};
```

### DELETE Examples

**Simple DELETE:**

```javascript
export const deleteEvent = async (eventId) => {
    const url = `${api}events/${eventId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};
```

**DELETE with body:**

```javascript
export const removeEventPhoto = async (eventId, photoId) => {
    const url = `${api}events/${eventId}/photos`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: JSON.stringify({ _id: photoId })
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};
```

**DELETE nested resource:**

```javascript
export const unregisterFromEvent = async (eventId, memberId) => {
    const url = `${api}events/${eventId}/attendees/${memberId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};
```

---

## Code Examples from ebirdService.js

The ebirdService.js file uses a simpler pattern with a single `callout()` helper for all GET requests.

### callout() Helper

```javascript
const callout = async (url) => {
    try {
        const res = await fetch(url, { method: 'GET' });
        return res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};
```

### eBird GET Examples

**Simple path parameter:**

```javascript
export const getRegions = async () => {
    const url = `${api}regions/US`;
    return callout(url);
};
```

**Object parameters with defaults (lat/lng nearby):**

```javascript
export const getNearbyNotableObservations = async ({
    lat,
    long,
    dist = 50,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
    return callout(url);
};
```

**Note:** Function parameter is `long` but URL uses `lng` (eBird API convention).

**Simple path parameter:**

```javascript
export const getHotspotDetails = async (locId) => {
    const url = `${api}hotspots/${locId}/details`;
    return callout(url);
};

export const getSpeciesDetailsByLocation = async (locId) => {
    const url = `${api}hotspots/${locId}/species`;
    return callout(url);
};
```

**Object parameters with different defaults:**

```javascript
export const getNearbyObservations = async ({
    lat,
    long,
    dist = 5,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
    return callout(url);
};
```

**Region-based with defaults:**

```javascript
export const getNotableSightingsByLocation = async ({
    regionCode,
    daysBack = 14
}) => {
    const url = `${api}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
    return callout(url);
};
```

**Note:** Uses `days` parameter (not `back` or `daysBack`).

**Hotspot search with object destructuring:**

```javascript
export const getNearbyHotspots = async ({ lat, long, dist = 50 }) => {
    const url = `${api}hotspots/nearby?lat=${lat}&long=${long}&dist=${dist}`;
    return callout(url);
};
```

**Note:** This function uses `long` in both parameter and URL (inconsistent with other nearby functions that convert to `lng`).

### Key ebirdService Patterns

1. **Single helper:** All functions use `callout()` (no post/patch/delete)
2. **Object destructuring:** Most functions use object params with defaults: `{ lat, long, dist = 50 }`
3. **Naming:** All functions prefixed with `get` (e.g., `getNearby...`, `getHotspot...`)
4. **Parameter naming:** Uses `long` in function signatures but converts to `lng` in URLs (except getNearbyHotspots)
5. **Default exports:** File exports both named exports and a default object with all functions

---

## API Endpoint Reference

### Health Check

| Method | Endpoint  | Params | Body | Response                                  | Description         |
| ------ | --------- | ------ | ---- | ----------------------------------------- | ------------------- |
| GET    | `/health` | -      | -    | `{ status, database, timestamp, uptime }` | Server health check |

---

### Events

| Method | Endpoint                 | Params        | Body                 | Response                             | Description                      |
| ------ | ------------------------ | ------------- | -------------------- | ------------------------------------ | -------------------------------- |
| GET    | `/events`                | -             | -                    | `Event[]`                            | Get all events                   |
| GET    | `/events/:year`          | year (path)   | -                    | `Event[]`                            | Get events by year               |
| GET    | `/events/future/:months` | months (path) | -                    | `Event[]`                            | Get upcoming events              |
| GET    | `/events/details/:id`    | id (path)     | -                    | `Event`                              | Get event details with attendees |
| POST   | `/events`                | -             | `CreateEventRequest` | `Event`                              | Create new event                 |
| PATCH  | `/events/:id`            | id (path)     | `UpdateEventRequest` | `Event`                              | Update event                     |
| DELETE | `/events/:id`            | id (path)     | -                    | `{ success, message, deletedEvent }` | Delete event                     |

**Event Schema:**

```typescript
{
  _id: string (ObjectId)
  event: string              // required
  start: string              // required, ISO 8601 or MM/DD/YYYY
  end?: string               // optional, must be >= start
  locations?: Array<{lat: number, lon: number}>
  tripLeader?: { memberId: string }
  attendees?: Array<Attendee>
  attendeeCount?: number
  cancelled?: boolean
  photos?: Array<EventPhoto>
}
```

**Validation Rules:**

- **Required:** `event`, `start`
- **Optional:** `end`, `locations`, `tripLeader`, `cancelled`
- **Constraints:**
    - `end` must be >= `start` if provided
    - `locations` must be array with valid lat/lon numbers
    - `tripLeader.memberId` must exist in members collection

---

### Event Attendees

| Method | Endpoint                               | Params                   | Body                      | Response                                      | Description         |
| ------ | -------------------------------------- | ------------------------ | ------------------------- | --------------------------------------------- | ------------------- |
| GET    | `/events/:eventId/attendees`           | eventId (path)           | -                         | `{ attendees, attendeeCount, attendedCount }` | Get event attendees |
| POST   | `/events/:eventId/attendees`           | eventId (path)           | `RegisterAttendeeRequest` | `{ success, message, attendee }`              | Register member     |
| DELETE | `/events/:eventId/attendees/:memberId` | eventId, memberId (path) | -                         | `{ success, message }`                        | Unregister member   |

**RegisterAttendeeRequest:**

```typescript
{
    memberId: string; // required
    email: string; // required, valid email format
    firstName: string; // required
    lastName: string; // required
}
```

---

### Event Photos

| Method | Endpoint                  | Params         | Body                      | Response                      | Description             |
| ------ | ------------------------- | -------------- | ------------------------- | ----------------------------- | ----------------------- |
| GET    | `/events/:eventId/photos` | eventId (path) | -                         | `{ photos }`                  | Get event photos        |
| POST   | `/events/:eventId/photos` | eventId (path) | `CreateEventPhotoRequest` | `{ success, message, photo }` | Add photo to event      |
| DELETE | `/events/:eventId/photos` | eventId (path) | `{ _id: string }`         | `{ success, message }`        | Remove photo from event |

**CreateEventPhotoRequest:**

```typescript
{
  cloudinary_public_id: string  // required
  header?: string
  description?: string
  contributor?: string
  photoDate?: string
  location?: { lat: number, lon: number }
}
```

---

### Members

| Method | Endpoint                    | Params                     | Body                  | Response                                 | Description                |
| ------ | --------------------------- | -------------------------- | --------------------- | ---------------------------------------- | -------------------------- |
| GET    | `/members`                  | -                          | -                     | `Member[]`                               | Get all members            |
| GET    | `/members/active`           | -                          | -                     | `Member[]`                               | Get active members         |
| GET    | `/members/officers`         | -                          | -                     | `Member[]`                               | Get officers               |
| GET    | `/members/email`            | email (query)              | -                     | `Member`                                 | Get member by email        |
| GET    | `/members/filter`           | first, last, email (query) | -                     | `Member[]`                               | Search members             |
| GET    | `/members/:memberId/events` | memberId (path)            | -                     | `Event[]`                                | Get member's event history |
| POST   | `/members`                  | -                          | `CreateMemberRequest` | `{ insertedId }`                         | Create member              |
| POST   | `/members/role`             | -                          | `{ email: string }`   | `{ role: 'member'\|'officer'\|'admin' }` | Get member role            |
| PATCH  | `/members/:id`              | id (path)                  | `UpdateMemberRequest` | `{ message, modifiedCount }`             | Update member              |

**Member Schema:**

```typescript
{
  _id: string (ObjectId)
  first: string      // required
  last: string       // required
  email: string      // required, unique, valid email format
  isActive?: boolean
  isOfficer?: boolean
  isAdmin?: boolean
}
```

**Validation Rules:**

- **Required:** `first`, `last`, `email`
- **Constraints:**
    - `email` must be unique and valid format
    - Role priority: admin > officer > member

---

### Announcements

| Method | Endpoint             | Params    | Body                        | Response                                    | Description                 |
| ------ | -------------------- | --------- | --------------------------- | ------------------------------------------- | --------------------------- |
| GET    | `/announcements`     | -         | -                           | `Announcement[]`                            | Get unexpired announcements |
| POST   | `/announcements`     | -         | `CreateAnnouncementRequest` | `Announcement`                              | Create announcement         |
| PATCH  | `/announcements/:id` | id (path) | `UpdateAnnouncementRequest` | `Announcement`                              | Update announcement         |
| DELETE | `/announcements/:id` | id (path) | -                           | `{ success, message, deletedAnnouncement }` | Delete announcement         |

**Announcement Schema:**

```typescript
{
    _id: string(ObjectId);
    date: string; // required, ISO 8601 or MM/DD/YYYY
    headline: string; // required
    details: string; // required
    expires: string; // required, must be > date
}
```

**Validation Rules:**

- **Required:** `date`, `headline`, `details`, `expires`
- **Constraints:**
    - `expires` must be after `date`

---

### Photos

| Method | Endpoint           | Params | Body                 | Response  | Description         |
| ------ | ------------------ | ------ | -------------------- | --------- | ------------------- |
| GET    | `/photos`          | -      | -                    | `Photo[]` | Get all photos      |
| GET    | `/photos/carousel` | -      | -                    | `Photo[]` | Get carousel photos |
| POST   | `/photos`          | -      | `CreatePhotoRequest` | `Photo`   | Create photo        |

**CreatePhotoRequest:**

```typescript
{
  header: string                // required
  cloudinary_public_id: string  // required
  description?: string
  category?: string
  photodate?: string
  contributor?: string
  location?: { lat: number, lon: number }
}
```

---

### Birding Locations

| Method | Endpoint            | Params                            | Body                    | Response                                | Description              |
| ------ | ------------------- | --------------------------------- | ----------------------- | --------------------------------------- | ------------------------ |
| GET    | `/locations`        | -                                 | -                       | `Location[]`                            | Get all active locations |
| GET    | `/locations/search` | county, state, type, name (query) | -                       | `Location[]`                            | Search locations         |
| GET    | `/locations/nearby` | lat, lng, maxDistance (query)     | -                       | `Location[]`                            | Find nearby locations    |
| GET    | `/locations/:id`    | id (path)                         | -                       | `Location`                              | Get location by ID       |
| POST   | `/locations`        | -                                 | `CreateLocationRequest` | `{ success, message, location }`        | Create location          |
| PATCH  | `/locations/:id`    | id (path)                         | `UpdateLocationRequest` | `{ success, message, location }`        | Update location          |
| DELETE | `/locations/:id`    | id (path)                         | -                       | `{ success, message, deletedLocation }` | Delete location          |

**CreateLocationRequest:**

```typescript
{
  name: string                  // required, unique
  description: string           // required
  lat: number                   // required, -90 to 90
  lon: number                   // required, -180 to 180
  county?: string
  state?: string
  ebirdHotspotIds?: string[]    // pattern: "L\d+"
  type?: string
  website?: string
  amenities?: string[]
}
```

**Search Query Parameters:**

- `county` - exact match
- `state` - exact match
- `type` - exact match
- `name` - case-insensitive regex search

**Nearby Query Parameters:**

- `lat` (required) - latitude (-90 to 90)
- `lng` (required) - longitude (-180 to 180)
- `maxDistance` (optional) - max distance in meters, default 50000

---

### eBird API Proxies

| Method | Endpoint                                  | Params                                  | Body | Response        | Description                  |
| ------ | ----------------------------------------- | --------------------------------------- | ---- | --------------- | ---------------------------- |
| GET    | `/taxonomy`                               | -                                       | -    | `Taxonomy[]`    | Get full eBird taxonomy      |
| GET    | `/taxonomy/location/:locId`               | locId (path)                            | -    | `Taxonomy[]`    | Get species for location     |
| GET    | `/sightings/location/:regionCode`         | regionCode (path), days (query)         | -    | `Observation[]` | Recent sightings by region   |
| GET    | `/sightings/location/:regionCode/notable` | regionCode (path), days, detail (query) | -    | `Observation[]` | Notable sightings by region  |
| GET    | `/sightings/nearby`                       | lat, lng, back, dist (query)            | -    | `Observation[]` | Recent sightings near point  |
| GET    | `/sightings/nearby/notable`               | lat, lng, back, dist, detail (query)    | -    | `Observation[]` | Notable sightings near point |
| GET    | `/hotspots/nearby`                        | lat, lng, dist (query)                  | -    | `Hotspot[]`     | Find nearby hotspots         |
| GET    | `/hotspots/:locId/details`                | locId (path)                            | -    | `Hotspot`       | Get hotspot details          |
| GET    | `/hotspots/:locId/species`                | locId (path)                            | -    | `string[]`      | Get hotspot species codes    |
| GET    | `/regions/:regionCode`                    | regionCode (path)                       | -    | `Region[]`      | Get subregions               |

**Query Parameters:**

- `lat`, `lng` - coordinates (required for nearby endpoints)
- `days` or `back` - days back to search (numeric)
- `dist` - distance in km (numeric)
- `detail` - "simple" or "full"
- `regionCode` - eBird region code (e.g., "US-VA", "US-VA-059")
- `locId` - eBird location ID (e.g., "L12345")

---

### Reference Data

| Method | Endpoint              | Params | Body | Response       | Description         |
| ------ | --------------------- | ------ | ---- | -------------- | ------------------- |
| GET    | `/locations/states`   | -      | -    | `State[]`      | Get states list     |
| GET    | `/locations/counties` | -      | -    | `County[]`     | Get counties list   |
| GET    | `/rarebirds`          | -      | -    | `RareBird[]`   | Get rare birds list |
| GET    | `/newsfeeds`          | -      | -    | `NewsFeed[]`   | Get news feeds list |
| GET    | `/news`               | -      | -    | `News[]`       | Get unexpired news  |
| GET    | `/faqs`               | -      | -    | `FAQ[]`        | Get active FAQs     |
| GET    | `/newsletters`        | -      | -    | `Newsletter[]` | Get newsletters     |

---

### Email

| Method | Endpoint      | Params | Body           | Response                          | Description         |
| ------ | ------------- | ------ | -------------- | --------------------------------- | ------------------- |
| POST   | `/mailertogo` | -      | `EmailRequest` | `{ success, message, messageId }` | Send email via SMTP |

**EmailRequest:**

```typescript
{
  to: string | string[]         // required, valid email(s)
  subject: string               // required
  html: string                  // required
  from?: string                 // optional, defaults to noreply@domain
  text?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}
```

**Note:** Current service uses `/sendgrid` endpoint, but API uses `/mailertogo`. Update service accordingly.

---

### RSS Feed

| Method | Endpoint | Params    | Body | Response             | Description    |
| ------ | -------- | --------- | ---- | -------------------- | -------------- |
| GET    | `/feed`  | u (query) | -    | Parsed RSS feed JSON | Parse RSS feed |

**Query Parameters:**

- `u` (required) - Feed URL (HTTPS only)

**Security:** Blocks private IP ranges and localhost (SSRF protection)

---

## Error Responses

All endpoints may return these error types:

### ValidationError (400)

```typescript
{
  error: "ValidationError"
  message: string
  statusCode: 400
  fields?: string[]  // optional array of invalid field names
}
```

**Common causes:**

- Missing required fields
- Invalid field formats (email, date, ObjectId)
- Constraint violations (end < start, invalid lat/lon)

### NotFoundError (404)

```typescript
{
    error: 'NotFoundError';
    message: string;
    statusCode: 404;
}
```

**Common causes:**

- Resource ID not found
- Member not found by email
- Event not found

### ConflictError (409)

```typescript
{
    error: 'ConflictError';
    message: string;
    statusCode: 409;
}
```

**Common causes:**

- Duplicate email when creating member
- Member already registered for event
- Photo already added to event
- Duplicate location name

### ServerError (500)

```typescript
{
    error: 'InternalServerError';
    message: string;
    statusCode: 500;
}
```

---

## Validation Rules Summary

### Common Field Formats

**ObjectId:**

- Format: 24-character hex string
- Example: `"507f1f77bcf86cd799439011"`

**Email:**

- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Case-insensitive

**Date:**

- Formats accepted: ISO 8601 or MM/DD/YYYY
- Stored as UTC
- Example: `"2026-05-01T09:00:00Z"` or `"05/01/2026"`

**Coordinates:**

- `lat`: -90 to 90 (decimal degrees)
- `lon` or `lng`: -180 to 180 (decimal degrees)

### Resource-Specific Rules

**Events:**

- `event` (title) is required
- `start` is required
- `end` must be >= `start` if provided
- `locations` must be array of `{lat: number, lon: number}`
- `tripLeader.memberId` must reference existing member

**Members:**

- `email` must be unique across collection
- `first`, `last`, `email` are required
- Role priority: `isAdmin` > `isOfficer` > regular member

**Announcements:**

- All fields required: `date`, `headline`, `details`, `expires`
- `expires` must be after `date`

**Photos:**

- `header` and `cloudinary_public_id` are required
- Other fields optional

**Locations:**

- `name` must be unique
- `lat`/`lon` required and within valid ranges
- `ebirdHotspotIds` must match pattern `L\d+` if provided
- If updating lat/lon, must update both together

**Event Attendees:**

- `memberId`, `email`, `firstName`, `lastName` all required
- Member cannot register twice for same event
- Email must be valid format

---

## Common Patterns

### Building Query Strings

**Single parameter:**

```javascript
const url = `${api}members/email?email=${encodeURIComponent(email)}`;
```

**Multiple parameters:**

```javascript
const url = `${api}members/filter?first=${member.first}&last=${member.last}&email=${member.email}`;
```

**With optional parameters:**

```javascript
const buildUrl = (base, params) => {
    const query = new URLSearchParams(
        Object.entries(params)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
    ).toString();
    return query ? `${base}?${query}` : base;
};

const url = buildUrl(`${api}sightings/nearby`, { lat, lng, dist, back });
```

### Object Transformation

When client data shape differs from API shape:

```javascript
export const savePhoto = async (photoData) => {
    const url = `${api}photos`;
    return post(
        url,
        JSON.stringify({
            cloudinary_public_id: photoData.publicId, // transform key
            header: photoData.title, // transform key
            description: photoData.description,
            location: photoData.location,
            contributor: photoData.contributor,
            photoDate: photoData.photoDate,
            category: photoData.category
        })
    );
};
```

### Response Normalization

When API might return legacy format:

```javascript
export const getMemberEvents = async (memberId) => {
    const url = `${api}members/${memberId}/events`;
    const events = await get(url);

    if (!events || !Array.isArray(events)) {
        console.warn('getMemberEvents: Unexpected response format', events);
        return [];
    }

    // Normalize field names
    return events.map((event) => ({
        _id: event._id,
        eventTitle: event.eventTitle || event.event, // legacy fallback
        eventStart: event.eventStart || event.start, // legacy fallback
        eventEnd: event.eventEnd || event.end // legacy fallback
    }));
};
```

---

## Usage Instructions

### When to Invoke This Skill

Use this skill when working on either:

- **`src/services/restdbService.js`** (CRUD operations: Events, Members, Announcements, Photos, Locations)
- **`src/services/ebirdService.js`** (eBird API proxy: Sightings, Hotspots, Taxonomy, Regions)

Invoke this skill for:

1. **Adding a new endpoint function**
2. **Modifying an existing endpoint function**
3. **Understanding request/response requirements**
4. **Applying proper validation**
5. **Following consistent code patterns**

### How to Invoke for restdbService.js

**Example 1: Add a new GET endpoint (restdbService)**

```
"Use fredbirds-api-client skill to add a function for getting location details by ID"
```

OpenCode will:

- Check the API reference for `GET /locations/:id`
- Follow the "GET with path parameter" pattern from restdbService
- Generate:

```javascript
export const getLocationById = async (locationId) => {
    const url = `${api}locations/${locationId}`;
    return get(url);
};
```

**Example 2: Add PATCH endpoint (restdbService)**

```
"Use fredbirds-api-client skill to add a function for updating a birding location"
```

OpenCode will:

- Find `PATCH /locations/:id` endpoint
- Check validation rules (lat/lon must be updated together)
- Follow the PATCH pattern
- Generate function using `patch()` helper

**Example 3: Add POST endpoint (restdbService)**

```
"Use fredbirds-api-client skill to add a function for creating an announcement"
```

OpenCode will:

- Find `POST /announcements` endpoint
- Check required fields (date, headline, details, expires)
- Check constraint (expires > date)
- Generate function using `post()` with JSON.stringify

**Example 4: Understand validation (restdbService)**

```
"Use fredbirds-api-client skill to explain what fields are required for creating an event"
```

OpenCode will reference the validation rules and respond with:

- Required: `event`, `start`
- Optional: `end`, `locations`, `tripLeader`, `cancelled`
- Constraints: end >= start, locations must have lat/lon

### How to Invoke for ebirdService.js

**Example 1: Add nearby sightings function (ebirdService)**

```
"Use fredbirds-api-client skill to add a function for getting recent sightings near coordinates"
```

OpenCode will:

- Find `GET /sightings/nearby` endpoint
- Follow ebirdService pattern with object destructuring
- Use `callout()` helper
- Generate:

```javascript
export const getNearbyObservations = async ({
    lat,
    long,
    dist = 5,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
    return callout(url);
};
```

**Example 2: Add taxonomy function (ebirdService)**

```
"Use fredbirds-api-client skill to add a function for getting species at a location"
```

OpenCode will:

- Find `GET /taxonomy/location/:locId` endpoint
- Follow ebirdService pattern for simple path parameters
- Generate:

```javascript
export const getTaxonomyForLocation = async (locId) => {
    const url = `${api}taxonomy/location/${locId}`;
    return callout(url);
};
```

**Example 3: Add regional sightings function (ebirdService)**

```
"Use fredbirds-api-client skill to add a function for getting regional sightings"
```

OpenCode will:

- Find `GET /sightings/location/:regionCode` endpoint
- Use object destructuring for optional parameters
- Generate:

```javascript
export const getRegionalSightings = async ({ regionCode, days = 14 }) => {
    const url = `${api}sightings/location/${regionCode}?days=${days}`;
    return callout(url);
};
```

---

## What OpenCode Will Know

When this skill is loaded, OpenCode has complete knowledge of:

✅ All 62 fredbirds-api endpoints  
✅ HTTP methods, paths, parameters for each endpoint  
✅ Request body schemas and required fields  
✅ Response shapes and types  
✅ Validation rules and constraints  
✅ Error types and status codes  
✅ Functional service patterns for **both** restdbService.js and ebirdService.js  
✅ Naming conventions from existing code in **both** services  
✅ URL construction patterns for **both** services  
✅ Request/response handling approaches  
✅ Real code examples from **both** restdbService.js and ebirdService.js

### Service-Specific Knowledge

**For restdbService.js:**

- GET/POST/PATCH/DELETE patterns using `get()`, `post()`, `patch()` helpers
- JSON.stringify usage (inconsistent - some endpoints stringify, some expect pre-stringified)
- Path parameter conventions (`:id`, `:year`, etc.)
- Query parameter encoding with `encodeURIComponent()`
- Object transformation patterns
- Error handling with try/catch and HTTP status checks

**For ebirdService.js:**

- Single `callout()` helper for all GET requests
- Object destructuring with default parameters
- Parameter naming (`long` in signatures, `lng` in URLs)
- Hardcoded query parameters (`detail=full`)
- Simpler error handling (console.error + throw)
- Default export pattern (both named and default object exports)

This enables OpenCode to generate service functions that:

- Match your existing code style **for the target service**
- Use correct endpoint URLs
- Apply proper validation
- Handle errors consistently
- Follow established naming conventions **per service**
- Transform data correctly between client and API shapes
- Use appropriate helper functions (`get/post/patch` vs `callout`)

---

## Maintenance Notes

**When to update this skill:**

- New endpoints added to fredbirds-api
- Endpoint signatures change (params, body, response)
- New validation rules added
- Service patterns evolve in restdbService.js or ebirdService.js

**How to update:**

- Edit this SKILL.md file directly
- Add new endpoints to the API Reference section
- Update validation rules as needed
- Add new code examples if patterns change in either service

**Keeping in sync:**

- This skill reflects fredbirds-api as of the endpoint catalog date
- Refer to `fredbirds-api/index.js` for authoritative API implementation
- Refer to `fredbirds/src/services/restdbService.js` for current CRUD service code
- Refer to `fredbirds/src/services/ebirdService.js` for current eBird proxy service code
