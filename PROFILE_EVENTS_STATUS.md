# Profile Events Attendance - Current Status

## ✅ Frontend Implementation - COMPLETE

The Profile component is fully implemented and ready. It correctly:

1. **Fetches member events** using `getMemberEvents(memberId)` → `GET /members/:memberId/events`
2. **Displays event table** with Event and Date columns
3. **Formats dates correctly**:
   - Single day: "September 7, 2010"
   - Same month multi-day: "September 7-10, 2010"
   - Different months: "September 29 - October 1, 2010"
4. **Implements pagination** - 5 events per page
5. **Sorts events** - Newest to oldest by `eventStart`

### Frontend Code References

- **Date formatting**: [Profile.jsx:270-294](src/components/Profile.jsx#L270-L294)
- **Event sorting**: [Profile.jsx:120-127](src/components/Profile.jsx#L120-L127)
- **Table display**: [Profile.jsx:907-932](src/components/Profile.jsx#L907-L932)
- **API call**: [restdbService.js:294-297](src/services/restdbService.js#L294-L297)

## ❌ Backend Implementation - NEEDS FIXING

### Current Problem

The backend endpoint `GET /members/:memberId/events` is returning **event documents** instead of **attendee records**.

**Current Response** (WRONG):
```json
[
  {
    "_id": "67b2338ea332737f96c0b952",
    "event": "Edwin B. Forsythe NWR/Cape May",        ← field name "event"
    "start": "2025-09-12T00:00:00.000Z",              ← field name "start"
    "end": "2025-09-14T00:00:00.000Z",                ← field name "end"
    "details": "...",
    "cancelled": false,
    "attendeeCount": 10
  }
]
```

**Expected Response** (CORRECT):
```json
[
  {
    "_id": "67b2338ea332737f96c0b952",
    "eventTitle": "Edwin B. Forsythe NWR/Cape May",   ← field name "eventTitle"
    "eventStart": "2025-09-12T00:00:00.000Z",         ← field name "eventStart"
    "eventEnd": "2025-09-14T00:00:00.000Z"            ← field name "eventEnd"
  }
]
```

### Why This Matters

The frontend Profile component looks for:
- `event.eventTitle` → Gets `undefined` → Shows "Untitled Event"
- `event.eventStart` → Gets `undefined` → Shows "Date not available"
- `event.eventEnd` → Gets `undefined`

### What Needs To Be Done

The backend needs to query the **attendees array** embedded in event documents and return the **denormalized attendee records** for the specified member.

## 📋 Implementation Guide

See [BACKEND_MEMBER_EVENTS.md](BACKEND_MEMBER_EVENTS.md) for:

1. **MongoDB Aggregation Pipeline** - Recommended approach
2. **Simpler Find + Map Approach** - Alternative if aggregation is too complex
3. **Code examples** with full implementation
4. **Testing instructions**

### Quick Summary of Backend Change Needed

```javascript
// Current (WRONG) - Returns event documents
app.get('/members/:memberId/events', (req, res) => {
  const memberId = req.params.memberId;

  db.collection('events').find({
    'attendees.memberId': memberId
  }).toArray((err, events) => {
    // Returns full event documents with wrong field names
    res.status(200).json(events);
  });
});

// Fixed (CORRECT) - Returns attendee records
app.get('/members/:memberId/events', (req, res) => {
  const memberId = req.params.memberId;

  // Use aggregation pipeline to extract attendee records
  const pipeline = [
    { $match: { 'attendees.memberId': memberId } },
    { $unwind: '$attendees' },
    { $match: { 'attendees.memberId': memberId } },
    {
      $project: {
        _id: '$_id',
        eventTitle: '$attendees.eventTitle',
        eventStart: '$attendees.eventStart',
        eventEnd: '$attendees.eventEnd'
      }
    },
    { $sort: { eventStart: -1 } }
  ];

  db.collection('events').aggregate(pipeline).toArray((err, events) => {
    res.status(200).json(events);
  });
});
```

## 🧪 Testing Checklist

After backend is updated:

1. ✅ Add a member to an event using `POST /events/:eventId/attendees`
2. ✅ Verify attendee record has `eventTitle`, `eventStart`, `eventEnd` in database
3. ✅ Call `GET /members/:memberId/events`
4. ✅ Verify response has correct field names
5. ✅ Check Profile page displays events with:
   - Correct event titles
   - Properly formatted dates
   - Correct sorting (newest first)
   - Working pagination

## 📁 Related Files

- **Frontend API Service**: [src/services/restdbService.js](src/services/restdbService.js)
- **Profile Component**: [src/components/Profile.jsx](src/components/Profile.jsx)
- **Attendance Schema**: [ATTENDANCE_SCHEMA.md](ATTENDANCE_SCHEMA.md)
- **Backend POST Update**: [BACKEND_UPDATE.md](BACKEND_UPDATE.md)
- **Backend GET Implementation**: [BACKEND_MEMBER_EVENTS.md](BACKEND_MEMBER_EVENTS.md)

## 🎯 Next Steps

1. **Backend Developer**: Implement the aggregation pipeline in `GET /members/:memberId/events`
2. **Test**: Verify the endpoint returns attendee records with correct field names
3. **Verify**: Check Profile page displays events correctly
4. **Done**: Feature complete!
