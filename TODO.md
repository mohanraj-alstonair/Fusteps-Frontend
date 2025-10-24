# Notification Fixes TODO

- [x] Modify `use-notifications.tsx` to mark student sessions as `unread: true` and include them in `unreadCount`
- [x] Add `markAsRead` function in `use-notifications.tsx` to set all notifications as read, set `unreadCount` to 0, and filter notifications to only show unread ones
- [x] Update `DashboardLayout.tsx` to call `markAsRead` when the notifications dropdown is opened
- [x] Test notification counts for students (messages + sessions) and mentors (bookings + connections)
- [x] Verify notifications disappear after viewing the dropdown
- [x] Add message notifications for mentors in `use-notifications.tsx`
- [x] Add persistence for read status using localStorage
- [x] Add 15-second auto-close timer for notification dropdown in `DashboardLayout.tsx`
