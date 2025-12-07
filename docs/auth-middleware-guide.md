# Auth Middleware Usage Guide

## Overview

The `authMiddleware` has been refactored to pass decoded user data to route handlers, eliminating duplicate token verification.

## How It Works

### 1. Middleware (`src/lib/middlewares/authMiddleware.ts`)

The middleware:

- Verifies the JWT token from cookies
- Returns 401 if token is missing or invalid
- Attaches decoded user data (`userId`, `email`) to the request
- Passes the authenticated request to the handler

```typescript
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}
```

### 2. Using in Route Handlers

**Before (with duplicate verification):**

```typescript
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return /* 401 */;

  const decoded = verifyToken(token);
  if (!decoded) return /* 401 */;

  // Use decoded.userId
  const user = await User.findById(decoded.userId);
  // ...
}
```

**After (with authMiddleware):**

```typescript
import authMiddleware, {
  AuthenticatedRequest,
} from "@/lib/middlewares/authMiddleware";

const getHandler = async (req: AuthenticatedRequest) => {
  // User data is already verified and available
  const { userId } = req.user;

  const user = await User.findById(userId);
  // ...
};

export const GET = authMiddleware(getHandler);
```

## Benefits

✅ **No Duplicate Code**: Token verification happens once in the middleware  
✅ **Type Safety**: `AuthenticatedRequest` provides TypeScript autocomplete for `req.user`  
✅ **Cleaner Handlers**: Focus on business logic, not auth boilerplate  
✅ **Consistent Error Handling**: All auth errors handled in one place  
✅ **Easier Testing**: Mock `req.user` instead of tokens

## Example: Pomodoro Start Route

```typescript
import authMiddleware, {
  AuthenticatedRequest,
} from "@/lib/middlewares/authMiddleware";
import { PomodoroSession } from "@/lib/models/PomodoroSessions";

const startHandler = async (req: AuthenticatedRequest) => {
  const { userId } = req.user; // Already verified!

  const body = await req.json();

  const session = await PomodoroSession.create({
    userId, // Use the verified userId
    startTime: new Date(),
    durationMinutes: body.duration || 25,
    isPomodoro: true,
  });

  return NextResponse.json({ success: true, session });
};

export const POST = authMiddleware(startHandler);
```

## Migrating Existing Routes

1. Import the middleware and type:

   ```typescript
   import authMiddleware, {
     AuthenticatedRequest,
   } from "@/lib/middlewares/authMiddleware";
   ```

2. Change handler signature:

   ```typescript
   const handler = async (req: AuthenticatedRequest) => {
   ```

3. Remove token verification code:

   ```typescript
   // DELETE these lines:
   const token = req.cookies.get("token")?.value;
   if (!token) return /* 401 */;
   const decoded = verifyToken(token);
   if (!decoded) return /* 401 */;
   ```

4. Use `req.user.userId` instead of `decoded.userId`:

   ```typescript
   const { userId } = req.user;
   ```

5. Export with middleware:
   ```typescript
   export const GET = authMiddleware(handler);
   // or
   export const POST = authMiddleware(handler);
   ```

## Complete Example

[me/route.ts:L98-L156](file:///g:/personal-projects/web-apps/sa3teen-gad/src/app/api/auth/me/route.ts#L98-L156)
