# Event Attendance Schema

## Overview
Event attendance is tracked using an embedded array of attendees within each event document. This allows for efficient querying and updates while maintaining data integrity.

## MongoDB Schema

### Events Collection - Attendees Array
```javascript
{
  // ... existing event fields ...
  attendees: [
    {
      memberId: String,           // Member's _id from members collection
      email: String,              // Member's email
      firstName: String,          // Member's first name
      lastName: String,           // Member's last name
      eventTitle: String,         // Title of the event (denormalized for member event history)
      eventStart: Date,           // Event start date (denormalized for member event history)
      eventEnd: Date              // Event end date (denormalized for member event history)
    }
  ],
  attendeeCount: Number           // Cached count of attendees
}
```

### Why Denormalize Event Title and Dates?
The event title and dates are stored in each attendee record to support efficient querying of a member's event history:
- When fetching `/members/:memberId/events`, we can return complete event information without joining to the events collection
- Handles multi-day events properly by storing both start and end dates
- Event title is stored as it appears at the time of registration (historical record)

## API Endpoints

### 1. Register Member for Event
**POST** `/events/:eventId/attendees`

**Request Body:**
```json
{
  "memberId": "507f1f77bcf86cd799439011",
  "email": "member@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "eventTitle": "Spring Bird Walk at Lake Park",
  "eventStart": "2024-04-15T09:00:00.000Z",
  "eventEnd": "2024-04-15T12:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member added to event",
  "attendee": {
    "memberId": "507f1f77bcf86cd799439011",
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "eventTitle": "Spring Bird Walk at Lake Park",
    "eventStart": "2024-04-15T09:00:00.000Z",
    "eventEnd": "2024-04-15T12:00:00.000Z"
  }
}
```

### 2. Remove Member from Event
**DELETE** `/events/:eventId/attendees/:memberId`

**Response:**
```json
{
  "success": true,
  "message": "Member removed from event"
}
```

### 3. Get Event Attendees
**GET** `/events/:eventId/attendees`

**Response:**
```json
{
  "eventId": "507f191e810c19729de860ea",
  "attendees": [
    {
      "memberId": "507f1f77bcf86cd799439011",
      "email": "member@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  ],
  "attendeeCount": 1
}
```

### 4. Get Member's Event History
**GET** `/members/:memberId/events`

**Response:**
```json
{
  "memberId": "507f1f77bcf86cd799439011",
  "events": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "Spring Bird Walk at Lake Park",
      "start": "2024-04-15T09:00:00.000Z",
      "end": "2024-04-15T12:00:00.000Z"
    }
  ]
}
```

## Implementation Notes

### Backend (MongoDB with Callbacks)
- Use `$push` to add attendees to the array
- Use `$pull` to remove attendees from the array
- Use `$inc` to update attendeeCount
- Use aggregation pipeline to query member event history across all events

### Frontend (React)
- Events.jsx: Attendee management UI in event dialog
- Profile.jsx: Display member's event attendance history with pagination (5 events per page)
- restdbService.js: API service functions for all attendance operations

### Data Consistency
- When adding an attendee, increment `attendeeCount`
- When removing an attendee, decrement `attendeeCount`
- Event title and dates are captured when adding attendee for historical accuracy
- Being in the attendees array means the member attended the event

### Multi-Day Events
- Events can span multiple days (e.g., weekend birding trips)
- Both `eventStart` and `eventEnd` dates are stored in attendee records
- UI displays date range for multi-day events
- Profile shows events sorted by start date (most recent first)
