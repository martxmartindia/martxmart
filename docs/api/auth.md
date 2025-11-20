# Authentication API

The Authentication API handles user registration, login, password management, and token operations.

## Base URL
```
/api/auth
```

## Endpoints

### Register User
Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "CUSTOMER",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

### Login
Authenticate user and get access tokens.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Phone Login
Authenticate using phone number and OTP.

```http
POST /api/auth/phone-login
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

### Send OTP
Send OTP to phone number for verification.

```http
POST /api/auth/send-otp
```

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpSent": true,
    "expiresIn": 300
  }
}
```

### Verify OTP
Verify OTP for phone number.

```http
POST /api/auth/verify-otp
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

### Refresh Token
Get new access token using refresh token.

```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Logout
Invalidate current session.

```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

### Forgot Password
Request password reset.

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
Reset password using reset token.

```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "newSecurePassword123"
}
```

### Change Password
Change password for authenticated user.

```http
PUT /api/auth/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123"
}
```

### Verify Email
Verify user email address.

```http
POST /api/auth/verify-email
```

**Request Body:**
```json
{
  "token": "email_verification_token"
}
```

### Resend Verification Email
Resend email verification link.

```http
POST /api/auth/resend-verification
```

**Headers:**
```
Authorization: Bearer <token>
```

## User Roles
- `CUSTOMER` - Regular customer
- `VENDOR` - Product vendor
- `ADMIN` - Platform administrator
- `FRANCHISE` - Franchise owner
- `AUTHOR` - Blog author

## Error Codes
- `AUTH_001` - Invalid credentials
- `AUTH_002` - User not found
- `AUTH_003` - Account not verified
- `AUTH_004` - Invalid OTP
- `AUTH_005` - OTP expired
- `AUTH_006` - Token expired
- `AUTH_007` - Invalid token
- `AUTH_008` - Account suspended
- `AUTH_009` - Email already exists
- `AUTH_010` - Phone already exists

## Security Features
- JWT tokens with expiration
- Refresh token rotation
- OTP-based phone verification
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Account lockout after failed attempts