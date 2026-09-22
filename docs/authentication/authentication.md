# Authentication Documentation

## VyuKarya Authentication

VyuKarya uses a token-based authentication system built with **Express, TypeScript, MongoDB/Mongoose, bcryptjs, and JSON Web Tokens (JWT)**.

The authentication system is responsible for:

- User registration
- User login
- Password hashing
- JWT generation
- Authentication of protected routes
- Retrieving the currently authenticated user
- Role-based authorization
- Preventing password data from being returned to clients

---

# 1. Authentication Architecture

The current authentication flow is organized into separate layers:

```text
Client
  │
  │ HTTP Request
  ▼
Route
  │
  ▼
Middleware
  │
  ├── protect
  │      │
  │      └── Verify JWT + Find User
  │
  └── authorize
         │
         └── Check User Role
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Model
  │
  ▼
MongoDB
````

Each layer has a specific responsibility.

| Layer                  | Responsibility                                        |
| ---------------------- | ----------------------------------------------------- |
| Route                  | Defines endpoint and middleware order                 |
| `protect` middleware   | Authenticates the request                             |
| `authorize` middleware | Checks user permissions                               |
| Controller             | Handles HTTP request/response                         |
| Service                | Contains authentication business logic                |
| Model                  | Communicates with MongoDB                             |
| Utility                | Handles reusable functionality such as JWT and errors |

---

# 2. Authentication vs Authorization

These are two different concepts.

## Authentication

Authentication answers:

> "Who is this user?"

VyuKarya uses JWT to authenticate users.

Example:

```text
Request
   ↓
Authorization: Bearer <token>
   ↓
JWT verification
   ↓
Extract user ID
   ↓
Find user in database
   ↓
req.user
```

---

## Authorization

Authorization answers:

> "What is this authenticated user allowed to do?"

VyuKarya uses the user's role for authorization.

Current roles:

```text
Owner
Admin
Member
```

Example:

```text
User authenticated?
        │
       YES
        ↓
Does role have permission?
        │
    ┌───┴───┐
   YES      NO
    ↓        ↓
 next()     403
```

Authentication happens before authorization.

---

# 3. User Registration

Endpoint:

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "Rishabh",
  "email": "rishabh@example.com",
  "password": "password123"
}
```

## Registration Flow

```text
POST /api/auth/register
          │
          ▼
auth.controller.register()
          │
          ▼
auth.service.register()
          │
          ├── Validate password
          │
          ├── Check existing user
          │
          ├── Hash password
          │
          ├── Create user
          │
          └── Generate JWT
          │
          ▼
      ApiResponse
```

The service performs the following operations.

### Step 1 — Validate password

The current implementation requires at least 6 characters.

```ts
if (password.length < 6) {
  throw new ApiError(
    400,
    "Password must be at least 6 digit",
  );
}
```

Invalid input produces:

```http
400 Bad Request
```

---

### Step 2 — Check whether the user already exists

```ts
const existingUser = await User.findOne({ email });

if (existingUser) {
  throw new ApiError(
    409,
    "User already exist",
  );
}
```

If the email already exists:

```http
409 Conflict
```

---

### Step 3 — Hash the password

The plaintext password is never stored directly.

```ts
const hashedPassword = await bcrypt.hash(
  password,
  10,
);
```

The `10` represents the bcrypt salt rounds used by the current implementation.

Example:

```text
password123
     ↓
bcrypt
     ↓
hashed password
     ↓
MongoDB
```

---

### Step 4 — Create the user

The current registration logic creates a new user with the default role:

```ts
role: "Member"
```

Example:

```ts
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "Member",
});
```

---

### Step 5 — Generate JWT

After creating the user:

```ts
const token = generateToken(
  user._id.toString(),
  user.role,
);
```

The JWT contains:

```json
{
  "id": "user-id",
  "role": "Member"
}
```

The token is configured with a 7-day expiration.

---

# 4. Registration Response

The service does not return the password.

Instead, it creates a safe user response:

```ts
const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};
```

The result is:

```json
{
  "user": {
    "id": "user123",
    "name": "Rishabh",
    "email": "rishabh@example.com",
    "role": "Member"
  },
  "token": "JWT_TOKEN"
}
```

The password is intentionally excluded.

---

# 5. Login

Endpoint:

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "rishabh@example.com",
  "password": "password123"
}
```

## Login Flow

```text
POST /api/auth/login
          │
          ▼
auth.controller.login()
          │
          ▼
auth.service.login()
          │
          ├── Find user
          │
          ├── Compare password
          │
          ├── Generate JWT
          │
          └── Return safe user data
          │
          ▼
      ApiResponse
```

---

## Step 1 — Find the user

```ts
const user = await User.findOne({ email });
```

If the user doesn't exist:

```http
401 Unauthorized
```

Current implementation:

```ts
if (!user) {
  throw new ApiError(
    401,
    "User not found",
  );
}
```

---

## Step 2 — Compare passwords

The submitted password is compared against the stored bcrypt hash.

```ts
const isPasswordCorrect =
  await bcrypt.compare(
    password,
    user.password,
  );
```

If the password is incorrect:

```http
401 Unauthorized
```

---

## Step 3 — Generate JWT

After successful password verification:

```ts
const token = generateToken(
  user._id.toString(),
  user.role,
);
```

---

## Step 4 — Return safe user information

The response contains:

```ts
const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};
```

The password is not returned.

---

# 6. JWT Generation

JWT generation is centralized in:

```text
src/utils/generateToken.ts
```

The current implementation receives:

```ts
generateToken(
  userId,
  role,
);
```

The token payload contains:

```json
{
  "id": "user123",
  "role": "Member"
}
```

The JWT is signed using:

```env
JWT_SECRET=...
```

The token expires after:

```text
7 days
```

Conceptually:

```text
User ID + Role
      ↓
 JWT Payload
      ↓
JWT_SECRET
      ↓
 Signed JWT
```

---

# 7. `protect` Middleware

The `protect` middleware is responsible for authenticating protected requests.

Location:

```text
src/middleware/auth.middleware.ts
```

It is used like:

```ts
router.get(
  "/me",
  protect,
  me,
);
```

This means the request must successfully pass `protect` before reaching the controller.

---

# 8. Authorization Header

The client sends the JWT using the HTTP Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

The middleware checks:

```ts
const authHeader =
  req.headers.authorization;
```

Then verifies that it starts with:

```text
Bearer
```

If the token is missing:

```http
401 Unauthorized
```

---

# 9. JWT Verification

After extracting the token:

```ts
const decoded = jwt.verify(
  token,
  secret,
);
```

JWT verification checks that:

* The token was signed using the expected secret.
* The token has not expired.
* The token is structurally valid.

If verification fails:

```http
401 Unauthorized
```

with:

```text
Invalid or expired token
```

---

# 10. Finding the User

JWT verification alone is not enough.

After decoding the token, the middleware obtains the user ID:

```ts
decoded.id
```

Then it queries MongoDB:

```ts
const user = await User.findById(
  decoded.id,
).select("-password");
```

This provides an additional check:

```text
JWT
 ↓
User ID
 ↓
MongoDB
 ↓
Does user still exist?
```

If the user doesn't exist:

```http
401 Unauthorized
```

---

# 11. Attaching User to Request

After successful authentication:

```ts
req.user = user;
```

The authenticated user becomes available to later middleware and controllers.

For example:

```ts
export const me = asyncHandler(
  async (req: Request, res: Response) => {
    const data =
      await authService.getUserById(
        req.user.id as string,
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User fetched successfully",
          data,
        ),
      );
  },
);
```

The flow is:

```text
JWT
 ↓
protect
 ↓
verify JWT
 ↓
find user
 ↓
req.user
 ↓
me controller
```

---

# 12. Current User — `/me`

Endpoint:

```http
GET /api/auth/me
```

Route:

```ts
router.get(
  "/me",
  protect,
  me,
);
```

This is a protected route.

The client must provide:

```http
Authorization: Bearer <JWT_TOKEN>
```

The request passes through:

```text
GET /api/auth/me
       │
       ▼
    protect
       │
       ├── Verify JWT
       ├── Find user
       └── req.user
       │
       ▼
      me()
       │
       ▼
getUserById(req.user.id)
       │
       ▼
   ApiResponse
```

---

# 13. Authorization Middleware

VyuKarya also contains an `authorize` middleware.

Location:

```text
src/middleware/authorize.ts
```

Its purpose is different from `protect`.

`protect`:

```text
"Is the user authenticated?"
```

`authorize`:

```text
"Does the authenticated user have the required role?"
```

Example:

```ts
router.delete(
  "/projects/:id",
  protect,
  authorize("Owner", "Admin"),
  deleteProject,
);
```

The middleware receives allowed roles:

```ts
authorize(
  "Owner",
  "Admin",
)
```

---

# 14. Authorization Flow

```text
Request
   │
   ▼
protect
   │
   ├── No user → 401
   │
   ▼
req.user
   │
   ▼
authorize("Owner", "Admin")
   │
   ├── No user → 401
   │
   ├── Wrong role → 403
   │
   ▼
Controller
```

The current implementation:

```ts
if (!req.user) {
  throw new ApiError(
    401,
    "Unauthorized",
  );
}

if (
  !req.user.role ||
  !roles.includes(req.user.role)
) {
  throw new ApiError(
    403,
    "Forbidden. Access denied",
  );
}

next();
```

---

# 15. HTTP Status Codes Used

| Status | Meaning      | Authentication Example                     |
| ------ | ------------ | ------------------------------------------ |
| `200`  | Success      | Login / `/me`                              |
| `201`  | Created      | Registration                               |
| `400`  | Bad Request  | Invalid password length                    |
| `401`  | Unauthorized | Missing/invalid authentication             |
| `403`  | Forbidden    | Authenticated but insufficient role        |
| `404`  | Not Found    | User doesn't exist                         |
| `409`  | Conflict     | Email already exists                       |
| `500`  | Server Error | Missing JWT configuration/unexpected error |

The important distinction is:

```text
401 → Authentication problem

403 → Authorization problem
```

Example:

```text
No valid token
    ↓
401

Valid token + Member trying Owner-only action
    ↓
403
```

---

# 16. Error Handling

Authentication errors are passed through the application's central error handler.

```text
Service / Middleware
        │
        ▼
    ApiError
        │
        ▼
   errorHandler
        │
        ▼
 HTTP Response
```

The `ApiError` class stores:

```ts
statusCode
message
success
errors
```

The error handler converts these into the API response.

---

# 17. Controller → Service Separation

Authentication follows the project's layered architecture.

Example:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Model / Utility
```

### Controller

Responsible for HTTP concerns:

```ts
const data =
  await authService.login(req.body);

return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      "Login successfully",
      data,
    ),
  );
```

### Service

Responsible for business logic:

```ts
const user =
  await User.findOne({ email });

const isPasswordCorrect =
  await bcrypt.compare(
    password,
    user.password,
  );
```

### Model

Responsible for database interaction:

```ts
User.findOne(...)
User.create(...)
User.findById(...)
```

This keeps the controller relatively thin.

---

# 18. Password Security

Passwords are hashed using `bcryptjs`.

The system does not store:

```text
password123
```

Instead, it stores a bcrypt hash.

During login:

```text
Entered password
       │
       ▼
bcrypt.compare()
       │
       ▼
Stored password hash
```

The application never needs to decrypt the stored password.

---

# 19. Password Exposure Prevention

Authentication responses deliberately create a safe user object:

```ts
const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};
```

The password field is therefore not returned during:

* Registration
* Login

Protected user lookup also uses:

```ts
.select("-password")
```

to exclude the password from the database result.

---

# 20. Current Authentication Endpoints

| Method | Endpoint             | Protected | Purpose                |
| ------ | -------------------- | --------: | ---------------------- |
| `POST` | `/api/auth/register` |        No | Register user          |
| `POST` | `/api/auth/login`    |        No | Login user             |
| `GET`  | `/api/auth/me`       |       Yes | Get authenticated user |

Current route definition:

```ts
router.post(
  "/register",
  register,
);

router.post(
  "/login",
  login,
);

router.get(
  "/me",
  protect,
  me,
);
```

---

# 21. Authentication Testing

Authentication has been tested at the middleware and service level.

## `authorize` tests

The authorization middleware tests:

```text
✓ Allowed role
✓ No authenticated user
✓ Wrong role
✓ Missing role
```

Expected behavior:

```text
Allowed role
    → next()

No user
    → 401

Wrong role
    → 403
```

---

## `protect` tests

The authentication middleware tests:

```text
✓ Valid JWT + existing user
✓ Missing token
✓ Invalid Authorization header
✓ Invalid JWT
✓ Expired JWT
✓ Valid JWT but missing user
✓ Missing JWT_SECRET
```

The most important successful path is:

```text
Valid JWT
   ↓
JWT verification
   ↓
User lookup
   ↓
req.user
   ↓
next()
```

---

# 22. Authentication Testing Philosophy

Tests are separated according to responsibility.

### Unit tests

Used for:

```text
ApiError
ApiResponse
generateToken
asyncHandler
authorize
authentication service logic
```

These tests isolate individual pieces of functionality.

### Integration tests

Used for:

```text
protect
errorHandler
authentication API
```

These tests verify that multiple pieces work together.

The goal is not simply to test whether functions execute.

The tests verify the authentication **contract**:

```text
Input
  ↓
Authentication logic
  ↓
Expected security behavior
  ↓
HTTP/error result
```

---

# 23. Current Authentication Flow — Complete Picture

```text
                    REGISTER
                       │
                       ▼
              POST /api/auth/register
                       │
                       ▼
                 Auth Controller
                       │
                       ▼
                  Auth Service
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Validate input     Find existing user
                                │
                                ▼
                         Hash password
                                │
                                ▼
                         Create User
                                │
                                ▼
                         Generate JWT
                                │
                                ▼
                           Response
```

Login:

```text
                     LOGIN
                       │
                       ▼
                POST /api/auth/login
                       │
                       ▼
                 Auth Controller
                       │
                       ▼
                  Auth Service
                       │
                 Find User
                       │
                       ▼
              Compare bcrypt password
                       │
                       ▼
                 Generate JWT
                       │
                       ▼
                    Response
```

Protected request:

```text
                 PROTECTED REQUEST
                       │
                       ▼
              Authorization Header
                       │
                       ▼
                  protect()
                       │
                       ▼
                 Verify JWT
                       │
                       ▼
                  Extract ID
                       │
                       ▼
                Find User
                       │
                       ▼
                   req.user
                       │
                       ▼
                 Controller
```

Role-protected request:

```text
              Protected Request
                     │
                     ▼
                  protect
                     │
                     ▼
                 req.user
                     │
                     ▼
            authorize("Owner")
                     │
               ┌─────┴─────┐
               ▼           ▼
            Owner       Other Role
               │           │
               ▼           ▼
            next()        403
```

---

# 24. Important Current-State Notes

The current implementation uses JWT and returns the token as part of the authentication response.

The project has **not yet finalized the production token-storage strategy**. In particular, decisions around:

* browser token storage
* HttpOnly cookies
* access-token lifetime
* refresh tokens
* CSRF protection
* XSS considerations
* logout/token invalidation

should be documented separately in an authentication ADR before production deployment.

This documentation therefore describes the **current implementation**, not a claim that every authentication security decision is final.

---

# 25. Future Authentication Improvements

Potential future work:

```text
Current
  │
  ├── Register
  ├── Login
  ├── JWT
  ├── protect
  ├── authorize
  └── /me
       │
       ▼
Future
  ├── Logout strategy
  ├── Token/session management
  ├── Email verification
  ├── Forgot password
  ├── Reset password
  ├── Refresh tokens
  ├── OAuth
  ├── Rate limiting
  ├── Account lockout / abuse protection
  └── Authentication audit logging
```

These should be implemented deliberately rather than added as unrelated authentication features.

---

# Summary

VyuKarya currently follows this authentication architecture:

```text
                    AUTHENTICATION
                          │
         ┌────────────────┼────────────────┐
         │                │                │
      Register           Login            /me
         │                │                │
         ▼                ▼                ▼
       Service          Service          protect
         │                │                │
         ▼                ▼                ▼
       bcrypt           bcrypt          JWT
         │                │                │
         └──────────┬─────┴────────────────┘
                    ▼
                  JWT
                    │
                    ▼
              Protected Routes
                    │
                    ▼
                authorize
                    │
             ┌──────┴──────┐
             ▼             ▼
          Allowed        Denied
             │             │
             ▼             ▼
          Controller      403
```

The key design separation is:

```text
Authentication
    = Who are you?

Authorization
    = What are you allowed to do?
```

VyuKarya implements these as separate middleware responsibilities:

```text
protect()
   → Authentication

authorize(...)
   → Authorization
```

```
```
