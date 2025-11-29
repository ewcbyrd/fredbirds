# Backend Update Required

## Current Code (OLD SCHEMA)
```javascript
// POST - Register member for event
app.post('/events/:eventId/attendees', (req, res) => {
    console.log('Register for event');
    const eventId = new require('mongodb').ObjectId(req.params.eventId);
    const { memberId, email, firstName, lastName } = req.body;  // ❌ MISSING NEW FIELDS

    // Validate required fields
    if (!memberId || !email || !firstName || !lastName) {
        return res.status(400).json({
            error: 'Missing required fields: memberId, email, firstName, lastName'
        });
    }

    // ... check if already registered ...

    // Add attendee to event
    const attendee = {
        memberId,
        email,
        firstName,
        lastName,
        registeredAt: new Date(),
        attended: null,        // ❌ REMOVE - not needed
        checkedInAt: null,     // ❌ REMOVE - not needed
        notes: ''              // ❌ REMOVE - not needed
    };

    // ... rest of code ...
});
```

## Updated Code (NEW SCHEMA)
```javascript
// POST - Register member for event
app.post('/events/:eventId/attendees', (req, res) => {
    console.log('Register for event');
    const eventId = new require('mongodb').ObjectId(req.params.eventId);

    // ✅ EXTRACT NEW FIELDS
    const {
        memberId,
        email,
        firstName,
        lastName,
        eventTitle,    // ✅ ADD
        eventStart,    // ✅ ADD
        eventEnd       // ✅ ADD
    } = req.body;

    // ✅ VALIDATE NEW REQUIRED FIELDS
    if (!memberId || !email || !firstName || !lastName || !eventTitle || !eventStart || !eventEnd) {
        return res.status(400).json({
            error: 'Missing required fields: memberId, email, firstName, lastName, eventTitle, eventStart, eventEnd'
        });
    }

    // First check if member is already registered
    const checkQuery = {
        _id: eventId,
        'attendees.memberId': memberId
    };

    db.collection('events').findOne(checkQuery, (err, existingEvent) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }

        if (existingEvent) {
            return res.status(409).json({
                error: 'Member already registered for this event'
            });
        }

        // ✅ CREATE ATTENDEE WITH NEW SCHEMA
        const attendee = {
            memberId,
            email,
            firstName,
            lastName,
            eventTitle,      // ✅ ADD - for member event history
            eventStart,      // ✅ ADD - for multi-day events
            eventEnd         // ✅ ADD - for multi-day events
        };

        const updateQuery = { _id: eventId };
        const update = {
            $push: { attendees: attendee },
            $inc: { attendeeCount: 1 }
        };

        db.collection('events').updateOne(updateQuery, update, (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Event not found' });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Successfully registered for event',
                    attendee
                });
            }
        });
    });
});
```

## Summary of Changes

### 1. Extract New Fields from Request Body (Line 5)
**Change:**
```javascript
// OLD
const { memberId, email, firstName, lastName } = req.body;

// NEW
const {
    memberId,
    email,
    firstName,
    lastName,
    eventTitle,
    eventStart,
    eventEnd
} = req.body;
```

### 2. Update Validation (Line 15)
**Change:**
```javascript
// OLD
if (!memberId || !email || !firstName || !lastName) {
    return res.status(400).json({
        error: 'Missing required fields: memberId, email, firstName, lastName'
    });
}

// NEW
if (!memberId || !email || !firstName || !lastName || !eventTitle || !eventStart || !eventEnd) {
    return res.status(400).json({
        error: 'Missing required fields: memberId, email, firstName, lastName, eventTitle, eventStart, eventEnd'
    });
}
```

### 3. Update Attendee Object (Line 36)
**Change:**
```javascript
// OLD
const attendee = {
    memberId,
    email,
    firstName,
    lastName,
    registeredAt: new Date(),
    attended: null,
    checkedInAt: null,
    notes: ''
};

// NEW
const attendee = {
    memberId,
    email,
    firstName,
    lastName,
    eventTitle,
    eventStart,
    eventEnd
};
```

## Why These Changes?

1. **eventTitle, eventStart, eventEnd** - Denormalized data for member event history
   - Allows querying member's events without joining collections
   - Supports multi-day events
   - Preserves historical accuracy (event info at registration time)

2. **Removed fields** (registeredAt, attended, checkedInAt, notes)
   - Not needed per simplified requirements
   - Being in attendees array = attended
   - No check-in or notes functionality needed

## Testing

After making these changes, test by:
1. Adding an attendee to an event
2. Check the database to verify the attendee record includes `eventTitle`, `eventStart`, and `eventEnd`
3. Verify the frontend console logs show the correct data being sent
