# Role-Based Authorization (RBAC) in NestJS with Auth0

## 🎯 Goal

Learn how to implement role-based access control (RBAC) in NestJS using Auth0 to ensure only authorized users can access specific features based on their assigned roles.

---

## 📚 Documentation

### Overview

This project demonstrates a complete RBAC implementation using NestJS and Auth0. The demo includes:

- **Public endpoint** (`/`) - Accessible to everyone
- **Dog-only endpoint** (`/dog`) - Only users with "dog" role can access
- **Cat-only endpoint** (`/cat`) - Only users with "cat" role can access

### Auth0 Setup

#### 1. Auth0 Application Configuration

![Auth0 Application](./nestjs-auth0-api/screenshots/auth0-application.png)

The Auth0 application is configured with:

- **Name**: NestJS RBAC Demo
- **Application Type**: Single Page Application
- **Allowed Callback URLs**: `https://localhost:3000`
- **Client ID**: `ncTAsfGZX7cgZSxavXZIx2qh8TQD8k7j`

#### 2. Auth0 API Configuration

![Auth0 API](./nestjs-auth0-api/screenshots/auth0-api.png)

The Auth0 API settings:

- **Name**: NestJS RBAC Demo API
- **Identifier**: `https://nestjs-rbac-demo.com/api`
- **Signing Algorithm**: RS256

#### 3. User Roles Setup

##### Dog Role Configuration

![Dog Role Permissions](./nestjs-auth0-api/screenshots/auth0-dog-role-permission.png)

The "dog" role is configured with:

- **Role Name**: dog
- **Description**: Dog user role
- **Permissions**: `read:dog`

##### Cat Role Configuration

![Cat Role Permissions](./nestjs-auth0-api/screenshots/auth0-cat-role-permission.png)

The "cat" role is configured with:

- **Role Name**: cat
- **Description**: Cat user role
- **Permissions**: `read:cat`

#### 4. User Assignment

##### Dog User

![Dog User with Role](./nestjs-auth0-api/screenshots/auth0-dog-user-with-dog-role.png)

User configuration:

- **Email**: `dog@example.com`
- **Password**: `SecurePass123!`
- **Assigned Role**: dog

##### Cat User

![Cat User with Role](./nestjs-auth0-api/screenshots/auth0-cat-user-with-cat-role.png)

User configuration:

- **Email**: `cat@example.com`
- **Password**: `SecurePass123!`
- **Assigned Role**: cat

#### 5. Custom Claims Action

![Custom Action](./nestjs-auth0-api/screenshots/auth-custome-action.png)

![Post Login Trigger](./nestjs-auth0-api/screenshots/auth0-post-login-trigger.png)

This action ensures user roles are included in the access token as custom claims.

### RBAC Implementation

#### 1. Roles Decorator

```typescript
// src/authorization/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

The `@Roles()` decorator allows us to specify which roles are required to access an endpoint.

#### 2. Role-Based Authorization Guard

```typescript
// src/authorization/role-based-authorization.guard.ts
@Injectable()
export class RoleBasedAuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {
    this.AUTH0_AUDIENCE = this.configService.get("AUTH0_AUDIENCE") || "";
    this.AUTH0_DOMAIN = this.configService.get("AUTH0_DOMAIN") || "";
    this.jwks = createRemoteJWKSet(
      new URL(`${this.AUTH0_DOMAIN}.well-known/jwks.json`)
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers?.authorization;

    // Validate Authorization Header
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or invalid authorization header"
      );
    }

    const token: string = authHeader.substring(7);

    try {
      // Verify JWT Token
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.AUTH0_DOMAIN,
        audience: this.AUTH0_AUDIENCE,
      });

      request.user = payload;

      // Check Required Roles
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (!requiredRoles) {
        return true; // No roles required, just valid token
      }

      // Extract User Roles from JWT
      const rolesClaimKey = "https://nestjs-rbac-demo.com/roles";
      const userRoles: string[] = Array.isArray(payload[rolesClaimKey])
        ? (payload[rolesClaimKey] as string[])
        : [];

      // Verify User Has Required Role
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied. Required roles: ${requiredRoles.join(
            ", "
          )}. User roles: ${userRoles.join(", ") || "none"}`
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid token");
    }
  }
}
```

#### 3. Controller Implementation

```typescript
// src/app.controller.ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Public endpoint - no authentication required
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Dog-only endpoint - requires "dog" role
  @Roles("dog")
  @UseGuards(RoleBasedAuthorizationGuard)
  @Get("/dog")
  getDog(): string {
    return this.appService.getDog();
  }

  // Cat-only endpoint - requires "cat" role
  @Roles("cat")
  @UseGuards(RoleBasedAuthorizationGuard)
  @Get("/cat")
  getCat(): string {
    return this.appService.getCat();
  }
}
```

#### 4. Service Implementation

```typescript
// src/app.service.ts
@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World! This endpoint is public and requires no authentication.";
  }

  getDog(): string {
    return "You can see this because you logged in as a DOG! 🐕";
  }

  getCat(): string {
    return "You can see this because you logged in as a CAT! 🐱";
  }
}
```

### How RBAC Works

1. **Token Generation**: Users authenticate with Auth0 and receive JWT tokens containing their roles
2. **Request Interception**: The guard intercepts requests to protected endpoints
3. **Token Validation**: JWT tokens are verified using Auth0's public keys
4. **Role Extraction**: User roles are extracted from the token's custom claims
5. **Authorization Check**: Required roles (from `@Roles()` decorator) are compared with user roles
6. **Access Decision**: Access is granted only if the user has at least one required role

---

## 🧪 Test Section

### Prerequisites

Ensure your NestJS server is running on `http://localhost:3000`.

### Test Case 1: Public Endpoint (Hello World)

**Endpoint**: `GET /`  
**Expected**: Anyone can access without authentication

![Hello World Test](./nestjs-auth0-api/screenshots/test/get-hello-world.png)

```bash
curl -X GET http://localhost:3000/
```

**Result**: ✅ Success - Returns "Hello World! This endpoint is public and requires no authentication."

### Test Case 2: Dog API with Dog User (Authorized)

**Endpoint**: `GET /dog`  
**User**: Dog user with "dog" role  
**Expected**: Access granted

![Dog Access Token](./nestjs-auth0-api/screenshots/test/get-dog-access-token.png)

```bash
curl -X GET http://localhost:3000/dog \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9..."
```

![Dog User Accessing Dog Endpoint](./nestjs-auth0-api/screenshots/test/get-dog-with-dog-user.png)

**Result**: ✅ Success - Returns "You can see this because you logged in as a DOG! 🐕"

### Test Case 3: Dog API with Cat User (Unauthorized)

**Endpoint**: `GET /dog`  
**User**: Cat user with "cat" role  
**Expected**: Access denied (403 Forbidden)

![Cat User Accessing Dog Endpoint](./nestjs-auth0-api/screenshots/test/get-dog-with-cat-user.png)

```bash
curl -X GET http://localhost:3000/dog \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9..."
```

**Result**: ❌ 403 Forbidden - "Access denied. Required roles: dog. User roles: cat"

### Test Case 4: Cat API with Cat User (Authorized)

**Endpoint**: `GET /cat`  
**User**: Cat user with "cat" role  
**Expected**: Access granted

![Cat Access Token](./nestjs-auth0-api/screenshots/test/get-cat-access-token.png)

```bash
curl -X GET http://localhost:3000/cat \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9..."
```

![Cat User Accessing Cat Endpoint](./nestjs-auth0-api/screenshots/test/get-cat-with-cat-user.png)

**Result**: ✅ Success - Returns "You can see this because you logged in as a CAT! 🐱"

### Test Case 5: Cat API with Dog User (Unauthorized)

**Endpoint**: `GET /cat`  
**User**: Dog user with "dog" role  
**Expected**: Access denied (403 Forbidden)

![Dog User Accessing Cat Endpoint](./nestjs-auth0-api/screenshots/test/get-cat-with-dog-user.png)

```bash
curl -X GET http://localhost:3000/cat \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9..."
```

**Result**: ❌ 403 Forbidden - "Access denied. Required roles: cat. User roles: dog"

### Test Case 6: Protected Endpoints without Authorization Header

**Endpoints**: `GET /dog` and `GET /cat`  
**Authorization**: None  
**Expected**: Authentication required (401 Unauthorized)

![No Authorization Header](./nestjs-auth0-api/screenshots/test/get-with-no-header.png)

```bash
# Test dog endpoint without header
curl -X GET http://localhost:3000/dog

# Test cat endpoint without header
curl -X GET http://localhost:3000/cat
```

**Result**: ❌ 401 Unauthorized - "Missing or invalid authorization header"

### Test Summary

| Test Case | Endpoint | User Role | Expected         | Actual           | Status  |
| --------- | -------- | --------- | ---------------- | ---------------- | ------- |
| 1         | `/`      | None      | 200 OK           | 200 OK           | ✅ Pass |
| 2         | `/dog`   | dog       | 200 OK           | 200 OK           | ✅ Pass |
| 3         | `/dog`   | cat       | 403 Forbidden    | 403 Forbidden    | ✅ Pass |
| 4         | `/cat`   | cat       | 200 OK           | 200 OK           | ✅ Pass |
| 5         | `/cat`   | dog       | 403 Forbidden    | 403 Forbidden    | ✅ Pass |
| 6a        | `/dog`   | None      | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| 6b        | `/cat`   | None      | 401 Unauthorized | 401 Unauthorized | ✅ Pass |

---

## 🤔 Reflection

### How does Auth0 store and manage user roles?

Based on this demo project, Auth0 stores and manages user roles through several mechanisms:

1. **Role Definitions**: Roles are defined in the Auth0 Dashboard with specific names (e.g., "dog", "cat") and associated permissions (e.g., "read:dog", "read:cat").

2. **User Assignment**: Roles are assigned to users through the Auth0 Dashboard, where administrators can directly assign one or multiple roles to individual users.

3. **Custom Claims**: Auth0 doesn't include roles in JWT tokens by default. We implemented a custom Auth0 Action that runs during the post-login flow to add roles as custom claims to the access token using the namespace `https://nestjs-rbac-demo.com/roles`.

4. **Token Storage**: Once added via the custom action, user roles are embedded within the JWT access token, making them available to our NestJS application without additional API calls.

### What is the purpose of a guard in NestJS?

A guard in NestJS serves as a **gatekeeper** that determines whether a request should be processed by a route handler. In our RBAC implementation:

1. **Access Control**: The `RoleBasedAuthorizationGuard` prevents unauthorized access to protected endpoints by validating JWT tokens and checking user roles.

2. **Authentication**: It verifies that the provided JWT token is valid, properly signed by Auth0, and hasn't expired.

3. **Authorization**: Beyond authentication, it ensures users have the appropriate roles (as specified by the `@Roles()` decorator) to access specific endpoints.

4. **Request Pipeline**: Guards execute before route handlers, allowing us to reject invalid requests early in the processing pipeline, improving security and performance.

5. **Separation of Concerns**: Guards keep authorization logic separate from business logic, making the codebase cleaner and more maintainable.

### How would you restrict access to an API endpoint based on user roles?

Our demo project demonstrates the complete workflow for role-based access restriction:

1. **Apply the Guard**: Use `@UseGuards(RoleBasedAuthorizationGuard)` on the controller or specific methods.

2. **Specify Required Roles**: Use the `@Roles('role1', 'role2')` decorator to define which roles can access the endpoint.

3. **Token Validation Process**:

   - Extract the Bearer token from the Authorization header
   - Verify the JWT signature using Auth0's public keys (JWKS)
   - Validate token claims (issuer, audience, expiration)

4. **Role Extraction and Comparison**:
   - Extract user roles from the custom claim `https://nestjs-rbac-demo.com/roles`
   - Compare required roles with user roles
   - Grant access if the user has at least one matching role

**Example Implementation**:

```typescript
@Roles('admin', 'moderator')  // Either role grants access
@UseGuards(RoleBasedAuthorizationGuard)
@Get('/admin-panel')
adminOnly() {
  return 'Admin content';
}
```

### What are the security risks of improper authorization, and how can they be mitigated?

#### Security Risks Identified:

1. **Privilege Escalation**: Users gaining access to resources beyond their authorization level.
2. **Token Manipulation**: Malicious actors attempting to modify JWT tokens.
3. **Role Confusion**: Incorrect role assignments leading to unintended access.
4. **Token Leakage**: Stolen tokens being used for unauthorized access.

#### Mitigation Strategies Implemented:

1. **JWT Signature Verification**: Our guard verifies tokens using Auth0's public keys, preventing token tampering.

2. **Centralized Role Management**: Roles are managed exclusively in Auth0, preventing local role manipulation.

3. **Namespaced Custom Claims**: Using `https://nestjs-rbac-demo.com/roles` prevents claim collision and ensures role integrity.

4. **Detailed Error Messages**: Our implementation provides specific error messages for debugging while not exposing sensitive information.

5. **Token Expiration**: JWT tokens have built-in expiration (24 hours in our demo), limiting the impact of token theft.

6. **HTTPS Enforcement**: All communication should use HTTPS to prevent token interception (recommended for production).

7. **Principle of Least Privilege**: Each role has only the minimum permissions necessary (demonstrated by separate dog/cat roles with specific permissions).

#### Additional Security Recommendations:

- Implement token refresh mechanisms for long-lived applications
- Use rate limiting to prevent brute force attacks
- Log all authorization attempts for monitoring and audit purposes
- Regularly rotate Auth0 signing keys
- Implement proper CORS policies
- Use environment variables for sensitive configuration (demonstrated with `.env` file)

This RBAC implementation demonstrates a production-ready approach to securing NestJS applications with proper authentication and authorization mechanisms using Auth0.
