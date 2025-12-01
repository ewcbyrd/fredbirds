# Backend Implementation: GET /members/:memberId/events

## Current Issue

The endpoint is currently returning event documents directly from the events collection:
```json
[
  {
    "_id": "67b2338ea332737f96c0b952",
    "event": "Edwin B. Forsythe NWR/Cape May",
    "start": "2025-09-12T00:00:00.000Z",
    "end": "2025-09-14T00:00:00.000Z",
    ...
  }
]
```

## Required Implementation

The endpoint should return attendee records from the denormalized attendance data:
```json
[
  {
    "_id": "67b2338ea332737f96c0b952",
    "eventTitle": "Edwin B. Forsythe NWR/Cape May",
    "eventStart": "2025-09-12T00:00:00.000Z",
    "eventEnd": "2025-09-14T00:00:00.000Z"
  }
]
```

## MongoDB Aggregation Pipeline

```javascript
// GET - Get member's event history
app.get('/members/:memberId/events', (req, res) => {
    const memberId = req.params.memberId;

    // Aggregation pipeline to find all events where member is in attendees array
    const pipeline = [
        // Match events where the member is in the attendees array
        {
            $match: {
                'attendees.memberId': memberId
            }
        },
        // Unwind the attendees array to work with individual attendee records
        {
            $unwind: '$attendees'
        },
        // Filter to only the matching member's attendee record
        {
            $match: {
                'attendees.memberId': memberId
            }
        },
        // Project only the fields we need from the attendee record
        {
            $project: {
                _id: '$_id',  // Event ID
                eventTitle: '$attendees.eventTitle',
                eventStart: '$attendees.eventStart',
                eventEnd: '$attendees.eventEnd'
            }
        },
        // Sort by eventStart in descending order (newest first)
        {
            $sort: {
                eventStart: -1
            }
        }
    ];

    db.collection('events').aggregate(pipeline).toArray((err, events) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to fetch member events' });
        }

        res.status(200).json(events);
    });
});
```

## Alternative Simpler Approach (if aggregation is complex)

If you prefer a simpler approach, you can query events and map the data:

```javascript
app.get('/members/:memberId/events', (req, res) => {
    const memberId = req.params.memberId;

    // Find all events where member is in attendees
    db.collection('events').find({
        'attendees.memberId': memberId
    }).toArray((err, events) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to fetch member events' });
        }

        // Extract the member's attendee record from each event
        const memberEvents = events.map(event => {
            // Find this member's attendee record
            const attendeeRecord = event.attendees.find(a => a.memberId === memberId);

            return {
                _id: event._id,
                eventTitle: attendeeRecord.eventTitle,
                eventStart: attendeeRecord.eventStart,
                eventEnd: attendeeRecord.eventEnd
            };
        }).sort((a, b) => {
            // Sort by eventStart descending (newest first)
            return new Date(b.eventStart) - new Date(a.eventStart);
        });

        res.status(200).json(memberEvents);
    });
});
```

## Why This Matters

### Denormalized Data Benefits:
1. **No Joins Required**: Event info is already in the attendee record
2. **Historical Accuracy**: Event title/dates captured at registration time
3. **Multi-Day Event Support**: Both start and end dates are available
4. **Simple Frontend**: Frontend expects `eventTitle`, `eventStart`, `eventEnd`

### Expected Response Format:
```json
[
  {
    "_id": "67b2338ea332737f96c0b952",
    "eventTitle": "Edwin B. Forsythe NWR/Cape May",
    "eventStart": "2025-09-12T00:00:00.000Z",
    "eventEnd": "2025-09-14T00:00:00.000Z"
  },
  {
    "_id": "67b2336fa332737f96c0b951",
    "eventTitle": "Summer Social",
    "eventStart": "2025-07-26T00:00:00.000Z",
    "eventEnd": null
  },
  {
    "_id": "685ec7f7508726969192aed7",
    "eventTitle": "FBC Happy Hour at Highmark Brewery",
    "eventStart": "2025-07-01T20:00:00.000Z",
    "eventEnd": null
  }
]
```

## Testing

After implementing, test with:
1. Add a member to an event using the updated `POST /events/:eventId/attendees` endpoint
2. Verify the attendee record has `eventTitle`, `eventStart`, `eventEnd`
3. Call `GET /members/:memberId/events`
4. Verify the response contains the denormalized event data
5. Check the frontend Profile page shows the events correctly formatted
