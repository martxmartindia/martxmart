# Permissions API

The Permissions API manages role-based access control and admin permissions.

## Base URL
```
/api/permissions
```

## Endpoints

### Get Admin Permissions
```http
GET /api/permissions
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "id": "perm_123",
        "adminId": "admin_123",
        "module": "USER_MANAGEMENT",
        "canView": true,
        "canCreate": true,
        "canEdit": true,
        "canDelete": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Update Permissions
```http
PUT /api/permissions/{adminId}
```

**Headers:**
```
Authorization: Bearer <super-admin-token>
```

**Request Body:**
```json
{
  "permissions": [
    {
      "module": "USER_MANAGEMENT",
      "canView": true,
      "canCreate": true,
      "canEdit": true,
      "canDelete": false
    },
    {
      "module": "PRODUCT_MANAGEMENT",
      "canView": true,
      "canCreate": false,
      "canEdit": true,
      "canDelete": false
    }
  ]
}
```

### Check Permission
```http
GET /api/permissions/check
```

**Query Parameters:**
- `module` (string) - Module name
- `action` (string) - Action type (view, create, edit, delete)

**Response:**
```json
{
  "success": true,
  "data": {
    "hasPermission": true,
    "module": "USER_MANAGEMENT",
    "action": "edit"
  }
}
```

### Get Available Modules
```http
GET /api/permissions/modules
```

**Response:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "name": "USER_MANAGEMENT",
        "displayName": "User Management",
        "description": "Manage platform users"
      },
      {
        "name": "PRODUCT_MANAGEMENT",
        "displayName": "Product Management",
        "description": "Manage products and catalog"
      },
      {
        "name": "ORDER_MANAGEMENT",
        "displayName": "Order Management",
        "description": "Manage orders and fulfillment"
      }
    ]
  }
}
```

## Permission Modules
- `USER_MANAGEMENT` - User operations
- `VENDOR_MANAGEMENT` - Vendor operations
- `PRODUCT_MANAGEMENT` - Product operations
- `ORDER_MANAGEMENT` - Order operations
- `FINANCIAL_MANAGEMENT` - Financial operations
- `CONTENT_MANAGEMENT` - Content operations
- `SYSTEM_SETTINGS` - System configuration
- `ANALYTICS_ACCESS` - Analytics and reports

## Permission Actions
- `canView` - View/read access
- `canCreate` - Create new records
- `canEdit` - Modify existing records
- `canDelete` - Delete records

## Admin Roles
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Standard admin operations
- `MODERATOR` - Content moderation
- `SUPPORT` - Customer support

## Error Codes
- `PERM_001` - Permission denied
- `PERM_002` - Invalid module
- `PERM_003` - Invalid action
- `PERM_004` - Admin not found