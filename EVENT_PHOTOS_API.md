# Event Photos API Documentation

## Overview
These endpoints manage photos associated with events. Photos are stored as an array on the event document in MongoDB.

## Endpoints

### POST /events/:eventId/photos
Add a photo to an event.

**Parameters:**
- `eventId` (URL parameter, required): MongoDB ObjectId of the event

**Request Body:**
```json
{
  "cloudinary_public_id": "string (required)",
  "header": "string (optional)",
  "description": "string (optional)",
  "contributor": "string (optional)",
  "photoDate": "string (optional)",
  "location": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully added photo to event",
  "photo": {
    "cloudinary_public_id": "string",
    "header": "string or null",
    "description": "string or null",
    "contributor": "string or null",
    "photoDate": "string or null",
    "location": "string or null"
  }
}
```

**Errors:**
- `400 Bad Request`: Missing required `cloudinary_public_id` field
- `404 Not Found`: Event not found
- `409 Conflict`: Photo already added to this event

---

### DELETE /events/:eventId/photos
Remove a photo from an event.

**Parameters:**
- `eventId` (URL parameter, required): MongoDB ObjectId of the event

**Request Body:**
```json
{
  "_id": "string (required)"
}
```

Note: The `_id` is the MongoDB ObjectId automatically assigned to each photo object in the photos array.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully removed photo from event"
}
```

**Errors:**
- `400 Bad Request`: Missing required `_id` field
- `404 Not Found`: Event not found or photo not found for this event

---

### GET /events/:eventId/photos
Retrieve all photos for an event.

**Parameters:**
- `eventId` (URL parameter, required): MongoDB ObjectId of the event

**Response (200 OK):**
```json
{
  "photos": [
    {
      "_id": "MongoDB ObjectId",
      "cloudinary_public_id": "string",
      "header": "string or null",
      "description": "string or null",
      "contributor": "string or null",
      "photoDate": "string or null",
      "location": "string or null"
    },
    ...
  ]
}
```

**Errors:**
- `404 Not Found`: Event not found

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cloudinary_public_id` | string | Yes | Unique identifier from Cloudinary for the image |
| `header` | string | No | Title or heading for the photo |
| `description` | string | No | Detailed description of the photo |
| `contributor` | string | No | Name or identifier of the person who contributed the photo |
| `photoDate` | string | No | Date the photo was taken (format: ISO 8601 or similar) |
| `location` | string | No | Location where the photo was taken |

---

## Example Usage

### Adding a photo to an event
```javascript
const eventId = '65a1b2c3d4e5f6g7h8i9j0k1';
const photoData = {
  cloudinary_public_id: 'fredbirds/photo_abc123',
  header: 'Golden Eagle Sighting',
  description: 'Beautiful golden eagle spotted near the river',
  contributor: 'John Smith',
  photoDate: '2025-12-13',
  location: 'Eagle Canyon Trail'
};

const response = await fetch(`/events/${eventId}/photos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(photoData)
});
```

### Retrieving photos for an event
```javascript
const eventId = '65a1b2c3d4e5f6g7h8i9j0k1';

const response = await fetch(`/events/${eventId}/photos`);
const data = await response.json();
console.log(data.photos);
```

### Removing a photo from an event
```javascript
const eventId = '65a1b2c3d4e5f6g7h8i9j0k1';
const photoId = '65a1b2c3d4e5f6g7h8i9j0k2'; // MongoDB _id of photo

const response = await fetch(`/events/${eventId}/photos`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ _id: photoId })
});
```

---

## Notes

- Each photo in the photos array is automatically assigned a MongoDB `_id` on creation
- Optional fields default to `null` if not provided
- Photos are stored directly on the event document as an array for quick access
- The `cloudinary_public_id` must be unique per event (duplicates are rejected)
