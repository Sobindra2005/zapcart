# Zustand Store Usage Examples

This folder contains example components demonstrating best practices for using the auth and user stores.

## Components

### LoginExample.tsx
Shows how to:
- Authenticate users
- Coordinate auth and user stores
- Use selectors for optimal rendering

### LogoutExample.tsx
Shows how to:
- Clear auth and user state
- Call logout API
- Clean up on logout

### UserProfileExample.tsx
Shows how to:
- Use granular selectors
- Display user information
- Optimize re-renders (component only re-renders when specific fields change)

### AuthGuardExample.tsx
Shows how to:
- Protect routes based on auth status
- Handle loading states
- Redirect unauthenticated users

## Usage in Your App

### 1. Wrap your app with StoreProvider

In your root layout (`app/layout.tsx`):

```tsx
import { StoreProvider } from '@/components/providers/StoreProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
```

### 2. Use stores in your components

```tsx
'use client';

import { useAuthStore, useUserStore, selectIsAuthenticated, selectUserName } from '@/stores';

export function MyComponent() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userName = useUserStore(selectUserName);

  return (
    <div>
      {isAuthenticated ? `Welcome, ${userName}!` : 'Please log in'}
    </div>
  );
}
```

### 3. Protect routes with AuthGuard

```tsx
import { AuthGuard } from '@/stores/examples/AuthGuardExample';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

## Best Practices

1. **Always use selectors**: Prevents unnecessary re-renders
2. **Split stores**: Keep auth and user separate for better organization
3. **Never store tokens**: Use httpOnly cookies for tokens
4. **Persist safely**: Only persist non-sensitive data
5. **Use StoreProvider**: Prevents hydration mismatches in Next.js

## Security Notes

- Tokens should be stored in httpOnly cookies (handled by your API)
- Never store sensitive data in localStorage or Zustand
- The stores only track authentication status and non-sensitive user info
- Always validate auth on the server side
