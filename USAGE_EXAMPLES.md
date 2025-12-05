# API Usage Examples

## Update User Profile - PUT /api/auth/me

This endpoint allows you to update user profile and settings with **partial updates**. You only need to send the fields you want to update.

### Features

✅ **Partial Updates**: Send only what you want to change  
✅ **Deep Merge**: Update nested settings without affecting other settings  
✅ **Type-Safe Validation**: All data is validated with Zod  
✅ **Flexible**: Update one field or multiple fields at once

---

### Example 1: Update Only Full Name

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullName: "أحمد محمد",
  }),
  credentials: "include", // Important: includes cookies
});

const data = await response.json();
console.log(data.user); // Updated user object
```

---

### Example 2: Update Profile Picture

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    profilePicture: "https://example.com/avatar.jpg",
  }),
  credentials: "include",
});
```

---

### Example 3: Enable Water Reminder

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      waterReminder: {
        enabled: true,
        interval: 30, // minutes
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 4: Update Prayer Reminder Settings

```typescript
// Enable prayer reminders globally
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      prayerReminder: {
        enabled: true,
        preReminderMinutes: 15,
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 5: Update Specific Prayer Settings

```typescript
// Disable pre-reminder for Fajr only
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      prayerReminder: {
        perPrayer: {
          Fajr: {
            pre: false,
            atTime: true,
          },
        },
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 6: Update Location

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      location: {
        country: "EGY",
        city: "Cairo",
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 7: Update Timer Settings

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      timers: {
        focusDurationTime: 30,
        shotBreakDuration: 10,
        longBreakDuration: 20,
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 8: Update Prayer Times Position

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      ui: {
        prayerTimesPosition: "left", // "top" | "left" | "right"
      },
    },
  }),
  credentials: "include",
});
```

---

### Example 9: Update Multiple Fields at Once

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullName: "أحمد محمد علي",
    profilePicture: "https://example.com/new-avatar.jpg",
    settings: {
      waterReminder: {
        enabled: true,
        interval: 25,
      },
      prayerReminder: {
        enabled: true,
        preReminderMinutes: 10,
        perPrayer: {
          Fajr: { pre: true, atTime: true },
          Dhuhr: { pre: true, atTime: true },
        },
      },
      location: {
        country: "EGY",
        city: "Alexandria",
      },
      ui: {
        prayerTimesPosition: "right",
      },
    },
  }),
  credentials: "include",
});
```

---

### React Hook Example

```typescript
// hooks/useUpdateUser.ts
import { useState } from "react";

interface UpdateUserData {
  fullName?: string;
  profilePicture?: string;
  settings?: any; // Use your SettingsType here
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (data: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "فشل التحديث");
      }

      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ ما";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

// Usage in component:
function SettingsComponent() {
  const { updateUser, loading, error } = useUpdateUser();

  const handleEnableWaterReminder = async () => {
    try {
      const updatedUser = await updateUser({
        settings: {
          waterReminder: {
            enabled: true,
            interval: 30,
          },
        },
      });
      console.log("User updated:", updatedUser);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <button onClick={handleEnableWaterReminder} disabled={loading}>
      {loading ? "جاري التحديث..." : "تفعيل تذكير الماء"}
    </button>
  );
}
```

---

### Response Format

#### Success Response (200)

```json
{
  "success": true,
  "message": "تم تحديث البيانات بنجاح",
  "user": {
    "id": "user_id_here",
    "fullName": "أحمد محمد",
    "email": "user@example.com",
    "profilePicture": "https://example.com/avatar.jpg",
    "provider": "email",
    "settings": {
      // ... full settings object
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "lastLoginAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Error Responses

**401 Unauthorized** - No token or invalid token

```json
{
  "success": false,
  "message": "غير مصرح"
}
```

**400 Bad Request** - Validation failed

```json
{
  "success": false,
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "fullName": ["الاسم يجب أن يكون حرفين على الأقل"],
    "settings.timers.focusDurationTime": [
      "Number must be greater than or equal to 1"
    ]
  }
}
```

**404 Not Found** - User not found

```json
{
  "success": false,
  "message": "المستخدم غير موجود"
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "message": "حدث خطأ ما"
}
```

---

### Validation Rules

#### fullName

- Minimum: 2 characters
- Maximum: 100 characters
- Trimmed automatically

#### profilePicture

- Must be a valid URL
- Can be null

#### settings.timers

- `focusDurationTime`: 1-120 minutes
- `shotBreakDuration`: 1-60 minutes
- `longBreakDuration`: 1-120 minutes

#### settings.waterReminder

- `interval`: 5-180 minutes

#### settings.prayerReminder

- `preReminderMinutes`: 1-60 minutes

#### settings.ui.prayerTimesPosition

- Must be one of: "top", "left", "right"

---

### Important Notes

1. **Authentication Required**: You must have a valid token cookie to use this endpoint
2. **Partial Updates**: You don't need to send all fields - only send what you want to update
3. **Deep Merge**: Nested settings are merged, not replaced. For example, updating `settings.waterReminder.enabled` won't affect `settings.prayerReminder`
4. **Validation**: All data is validated before updating. Invalid data will return a 400 error with details
5. **Protected Fields**: You cannot update: `_id`, `email`, `provider`, `googleId`, `createdAt`
6. **Timestamps**: `updatedAt` is automatically updated by MongoDB
