# FredBirds Component Guide

This guide documents the standardized reusable components introduced to ensure UI consistency and maintainability across the application.

## 1. AppDialog

A standardized wrapper for Material-UI Dialogs, handling titles, closing behavior, and loading states.

**Props:**
- `open` (bool): Whether the dialog is open.
- `onClose` (func): Callback when closing.
- `title` (string): Title of the dialog.
- `loading` (bool): If true, disables close actions and shows loading behavior (if applicable).
- `actions` (node): Buttons/actions for the dialog footer.
- `fullScreen` / `mobileFullScreen` (bool): Helper props for responsive sizing.

**Usage:**

```jsx
import AppDialog from './common/AppDialog'

<AppDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Dialog"
  actions={<Button onClick={handleSave}>Save</Button>}
>
  <DialogContentText>
    Dialog content goes here...
  </DialogContentText>
</AppDialog>
```

## 2. AppCard

A versatile card component for displaying items in lists or grids. It supports standard card features plus flexible media handling.

**Props:**
- `title` (string): Card title.
- `subtitle` (string): Card subtitle.
- `image` (string): URL for the card image.
- `customMedia` (node): Custom content to render in place of the image (e.g., Avatars, Placeholders).
- `onClick` (func): If provided, makes the card interactive/clickable.

**Usage (Image):**
```jsx
import AppCard from './common/AppCard'

<AppCard
  title="Event Name"
  image="path/to/image.jpg"
  onClick={() => handleClick()}
>
  <Typography>Description...</Typography>
</AppCard>
```

**Usage (Custom Media/Avatar):**
```jsx
<AppCard
  title="Member Name"
  customMedia={<Avatar>MN</Avatar>}
>
  <Typography>Details...</Typography>
</AppCard>
```

## 3. Admin Tools Components

These components are designed for the "Officer Tools" administrative sections.

### AdminResourceList

A standardized list container dealing with loading states, error states, and empty states.

**Props:**
- `items` (array): Data to display.
- `renderItem` (func): Function to render each item (usually returns an `AdminItemCard`).
- `onAdd` (func): Callback for the "Add New" button.
- `onSearch` (func): Callback for search input.
- `loading` (bool): Loading state.

**Usage:**
```jsx
import AdminResourceList from './common/AdminResourceList'

<AdminResourceList
  items={users}
  renderItem={(user) => <AdminItemCard title={user.name} />}
  onAdd={handleAddUser}
  loading={isLoading}
/>
```

### AdminItemCard

A row-style card optimized for admin lists, with slots for icons, titles, and action buttons.

**Props:**
- `title` (string): Main text.
- `subtitle` (string): Secondary text.
- `icon` (node): Icon or Avatar to display on the left.
- `actions` (node): Action buttons (Edit, Delete, etc.) for the bottom/right.

**Usage:**
```jsx
import AdminItemCard from './common/AdminItemCard'

<AdminItemCard
  title="Announcement Title"
  subtitle="Created: Jan 1, 2024"
  actions={<Button>Edit</Button>}
>
  <p>Extra content...</p>
</AdminItemCard>
```
