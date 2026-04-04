---
name: access-control
description: Role-based access control system with four tiers for the fredbirds project
---

## Access Control System

### Four-Tier Role Hierarchy
Defined in `src/hooks/useUserRole.js`:

| Level | Constant | Numeric | Who |
|-------|----------|---------|-----|
| PUBLIC | `ACCESS_LEVELS.PUBLIC` | 0 | Unauthenticated visitors |
| MEMBER | `ACCESS_LEVELS.MEMBER` | 1 | Authenticated club members |
| OFFICER | `ACCESS_LEVELS.OFFICER` | 2 | Club officers |
| ADMIN | `ACCESS_LEVELS.ADMIN` | 3 | Administrators |

Higher levels inherit access from lower levels (an ADMIN can see everything a MEMBER can).

### How to Import
```jsx
import { ACCESS_LEVELS } from '../hooks/useUserRole'
import { useUserRole } from '../hooks/useUserRole'
```

### The useUserRole Hook
Returns:
```jsx
const { userRole, roleLoading, hasAccess } = useUserRole()
```
- `userRole` -- current user's role string (e.g., `'member'`, `'officer'`)
- `roleLoading` -- boolean, true while role is being determined
- `hasAccess(requiredLevel)` -- function that checks if user meets the required level

### Protecting Routes (in App.jsx)
Two wrapper components are used in route definitions:

**ProtectedRoute** -- requires authentication (any logged-in user):
```jsx
<Route path="/dashboard" element={
    <ProtectedRoute>
        <MemberDashboard />
    </ProtectedRoute>
} />
```

**MemberAccessControl** -- requires a specific role level:
```jsx
<Route path="/officer-tools" element={
    <ProtectedRoute>
        <MemberAccessControl requiredLevel={ACCESS_LEVELS.OFFICER}>
            <OfficerTools />
        </MemberAccessControl>
    </ProtectedRoute>
} />
```

### Protecting UI Elements Within Components
Use `hasAccess()` to conditionally render buttons, sections, or actions:
```jsx
const { hasAccess } = useUserRole()

{hasAccess(ACCESS_LEVELS.OFFICER) && (
    <Button onClick={handleEdit}>Edit</Button>
)}
```

### Auth State
Auth0 provides the authentication layer:
```jsx
import { useAuth0 } from '@auth0/auth0-react'
const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()
```

### Role Determination Order
The hook checks roles in this order:
1. Auth0 `app_metadata.role`
2. Auth0 custom claims (`https://birdingclub.com/roles`)
3. Backend API lookup via `getUserRole()` from restdbService
4. Falls back to `ACCESS_LEVELS.PUBLIC`

### Common Access Patterns
- **Public pages**: Home, About, Contact, FAQs, Events, News, Resources -- no protection needed
- **Member pages**: Dashboard, Profile, Members Directory, Photos -- wrap in `ProtectedRoute`
- **Officer pages**: Officer Tools, Manage Events/Members/Announcements -- wrap in `MemberAccessControl` with `ACCESS_LEVELS.OFFICER`
- **Admin pages**: Admin Panel -- wrap in `MemberAccessControl` with `ACCESS_LEVELS.ADMIN`
