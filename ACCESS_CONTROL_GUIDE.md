# Access Control Implementation Guide

## Overview

This guide explains how to implement and use the access control system for your birding club website. The system provides four access levels: **Public**, **Member**, **Officer**, and **Admin**.

## Access Levels

### 1. **Public** (Level 0)
- **Who**: Visitors, non-authenticated users
- **Access**: Basic website content, events calendar, general information
- **Restrictions**: Cannot access member-only content

### 2. **Member** (Level 1)
- **Who**: Authenticated club members
- **Access**: All public content + member dashboard, profile management
- **Restrictions**: Cannot access officer/admin tools

### 3. **Officer** (Level 2)
- **Who**: Club officers, board members, coordinators
- **Access**: All member content + event management, announcements, member directory
- **Restrictions**: Cannot access system admin tools

### 4. **Admin** (Level 3)
- **Who**: System administrators, club presidents
- **Access**: Full access to all features + user management, system settings
- **Restrictions**: None

## Implementation Components

### Core Hooks

#### `useUserRole` Hook
```javascript
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'

const { userRole, hasAccess, isRole, isAdmin } = useUserRole()

// Check specific access level
if (hasAccess(ACCESS_LEVELS.OFFICER)) {
  // Show officer features
}
```

### Access Control Components

#### `AccessControl` Component
Wrap any content that requires specific access levels:

```jsx
import AccessControl from './AccessControl'
import { ACCESS_LEVELS } from '../hooks/useUserRole'

// Basic usage
<AccessControl requiredLevel={ACCESS_LEVELS.MEMBER}>
  <MemberOnlyContent />
</AccessControl>

// With custom message
<AccessControl 
  requiredLevel={ACCESS_LEVELS.OFFICER}
  customMessage="This feature is only available to club officers."
>
  <OfficerTools />
</AccessControl>

// Hide completely if no access (no message)
<AccessControl 
  requiredLevel={ACCESS_LEVELS.ADMIN}
  showMessage={false}
>
  <AdminPanel />
</AccessControl>
```

#### `RoleBadge` Component
Display user's current role:

```jsx
import RoleBadge from './RoleBadge'

// With icon and text
<RoleBadge showIcon={true} variant="filled" />

// Text only
<RoleBadge showIcon={false} variant="outlined" />
```

## Role Determination Logic

The system checks user roles in the following order:

1. **Auth0 app_metadata** - If role is set in Auth0 user metadata
2. **Auth0 custom claims** - If role is in custom claims (`https://birdingclub.com/roles`)
3. **Database lookup** - API call to `/api/user-role` endpoint
4. **Default assignment** - Authenticated users default to 'member'

## Database Structure

### Officers Collection
```javascript
{
  name: "John Smith",
  email: "john@example.com",
  position: "President", // Auto-grants admin if contains "president" or "chair"
  auth0Id: "auth0|user123", // Links to Auth0 user
  isAdmin: true, // Explicit admin flag
  memberSince: "2020-01-01"
}
```

### Members Collection
```javascript
{
  name: "Jane Doe",
  email: "jane@example.com", 
  auth0Id: "auth0|user456",
  memberSince: "2021-06-15",
  status: "active", // active, pending, suspended
  autoEnrolled: false // Set true for auto-enrolled users
}
```

## API Endpoint

The `/api/user-role` endpoint handles role determination:

```javascript
POST /api/user-role
{
  "email": "user@example.com",
  "auth0Id": "auth0|123456"
}

// Response
{
  "role": "member", // public, member, officer, admin
  "user": {
    "name": "User Name",
    "email": "user@example.com",
    "memberSince": "2021-01-01"
  }
}
```

## Usage Examples

### 1. Protecting Routes
```jsx
// In App.jsx
import AccessControl from './AccessControl'
import { ACCESS_LEVELS } from './hooks/useUserRole'

<Route path="/admin" element={
  <AccessControl requiredLevel={ACCESS_LEVELS.ADMIN}>
    <AdminPanel />
  </AccessControl>
} />
```

### 2. Conditional Menu Items
```jsx
// In navigation component
const { hasAccess } = useUserRole()

{hasAccess(ACCESS_LEVELS.OFFICER) && (
  <MenuItem onClick={() => navigate('/officer-tools')}>
    Officer Tools
  </MenuItem>
)}
```

### 3. Feature Flags in Components
```jsx
// In existing components
import AccessControl from './AccessControl'

<AccessControl requiredLevel={ACCESS_LEVELS.OFFICER} showMessage={false}>
  <Button onClick={handleCreateEvent}>
    Create New Event
  </Button>
</AccessControl>
```

### 4. Role-Based Content
```jsx
const { userRole, isRole } = useUserRole()

return (
  <Box>
    <Typography variant="h4">
      Welcome, {isRole('admin') ? 'Administrator' : 'Member'}!
    </Typography>
    
    <RoleBadge showIcon={true} />
  </Box>
)
```

## Setup Instructions

### 1. Database Setup
Run the setup script to create test data:
```bash
node scripts/setup-access-levels.js
```

### 2. Environment Variables
Ensure your `.env.local` contains:
```
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
MONGODB_URI=your-mongodb-connection-string
```

### 3. Auth0 Configuration
- Configure Google OAuth provider
- Set up allowed callback URLs
- Optionally configure custom claims in Auth0 rules

### 4. Deploy API Endpoint
Deploy the `/api/user-role` endpoint to your serverless platform (Vercel, Netlify, etc.)

## Testing Access Levels

### Test Users (from setup script):
- **Members**: `john.member@example.com`, `jane.birder@gmail.com`
- **Officers**: `sarah.officer@example.com`, `mike.leader@birdclub.org`  
- **Admin**: `admin@birdclub.org`

### Test Flow:
1. Log in with a test email via Auth0 Google OAuth
2. System will match email to database and assign role
3. Check profile menu for role-specific options
4. Navigate to protected pages to verify access control

## Customization

### Adding New Access Levels
1. Update `ACCESS_LEVELS` in `useUserRole.js`
2. Update `ROLE_HIERARCHY` object
3. Add new role badge configuration in `RoleBadge.jsx`
4. Update API endpoint logic in `/api/user-role.js`

### Custom Access Logic
Override role determination in `useUserRole.js`:

```javascript
// Custom logic based on user attributes
if (user.email.endsWith('@birdclub.org')) {
  setUserRole(ACCESS_LEVELS.OFFICER)
}
```

### Role-Based Styling
```jsx
const { userRole } = useUserRole()

const getRoleColor = () => {
  switch(userRole) {
    case ACCESS_LEVELS.ADMIN: return 'error'
    case ACCESS_LEVELS.OFFICER: return 'secondary'  
    case ACCESS_LEVELS.MEMBER: return 'primary'
    default: return 'default'
  }
}
```

## Best Practices

1. **Server-side Validation**: Always validate permissions on the server/API level
2. **Graceful Degradation**: Use `showMessage={false}` for optional features
3. **Clear Feedback**: Provide clear messages when access is denied
4. **Role Hierarchy**: Use `hasAccess()` instead of exact role matching for future flexibility
5. **Loading States**: Handle loading states properly while checking roles
6. **Error Handling**: Implement fallbacks for role determination failures

## Security Considerations

1. **Client-side Only**: This system provides UI access control only
2. **API Security**: Implement server-side role validation for sensitive operations
3. **Token Validation**: Validate Auth0 tokens on API endpoints
4. **Role Persistence**: Roles are determined on each session, not stored client-side
5. **Audit Trail**: Consider logging role-based actions for security auditing

## Troubleshooting

### Common Issues:

1. **Role not updating**: Clear Auth0 cache and re-login
2. **API endpoint not found**: Verify deployment and environment variables
3. **Database connection**: Check MongoDB URI and network access
4. **Auth0 errors**: Verify domain and client ID configuration

### Debug Mode:
Enable debug logging in `useUserRole.js` to trace role determination:

```javascript
console.log('Role determination:', { 
  user: user?.email, 
  role: userRole, 
  method: 'database' // auth0, custom_claims, database, default
})
```

This access control system provides a flexible foundation that can be extended as your birding club's needs grow!