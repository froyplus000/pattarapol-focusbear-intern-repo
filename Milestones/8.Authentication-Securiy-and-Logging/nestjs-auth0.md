# Authentication in NestJS with Auth0 & JWT - Documentation and Reflection

## 🎯 Project Goal

Learn how authentication works in NestJS using Auth0 and JWT tokens for securing API endpoints.

## 📋 Table of Contents

1. [Auth0 Setup and Configuration](#auth0-setup-and-configuration)
2. [NestJS Implementation](#nestjs-implementation)
3. [Testing with Bruno](#testing-with-bruno)
4. [Technical Reflection](#technical-reflection)

---

## 1. Auth0 Setup and Configuration

### 1.1 Creating Auth0 Application

We started by setting up an Auth0 application and API to handle authentication for our NestJS demo.

![Auth0 Application Setup](nestjs-auth0-demo/screenshots/auth0-application.png)

### 1.2 Auth0 API Configuration

Created an API resource in Auth0 with the identifier `https://nestjs.auth0.demo.api`.

![Auth0 API Configuration](nestjs-auth0-demo/screenshots/auth0-api.png)

### 1.3 Getting Access Token

To authenticate with our API, we need to get an access token from Auth0 using the client credentials flow:

```bash
curl --request POST \
  --url https://dev-nmovz0sdbo0nyccf.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2",
    "client_secret":"Pfe3KicjcHLQlED-kysautayeIFoW0cuMci6jik6MxpFhp6XsWocB4YuCDycT-uv",
    "audience":"https://nestjs.auth0.demo.api",
    "grant_type":"client_credentials"
  }'
```

![Getting Access Token](nestjs-auth0-demo/screenshots/get-access-token.png)

**Example Token Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ubW92ejBzZGJvMG55Y2NmLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiI4Z1dzcE1VSFNlNTR0NHIwY1lReGVFR1g0SEJBRzJ6MkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9uZXN0anMuYXV0aDAuZGVtby5hcGkiLCJpYXQiOjE3NTgwNDAzNDMsImV4cCI6MTc1ODEyNjc0MywiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiOGdXc3BNVUhTZTU0dDRyMGNZUXhlRUdYNEhCQUcyejIifQ.UxASWao9nnTZF8nYtWDnS6h5FOIrkD4CfzAtT8Y6i0T-q28i9r3pgEbh2SO8Py9xss4DGbHpTCh-g02Jp9ex0yTohjIBaPhvS45JdzR0AzmVSFdzJZXpHWlNJYN44rxFSffBkUc_KRvt8sUGpqDOZ4VcUmr2d_ExUi8HmCEZdGSw8Qgy2r0uiaX3FAzXyddE_NeyTB0tcR2w_Lc3Jvi6F8ijT2DxC1sKb-wsKxI-Vt5KqDc63ge9k9m_ELZ5porayi8WxCiRMc7atAwHqmC37DMLtdQdWderot-NrgSGXKjGWSY9ZEQo_wdHmySS_T_WB_pu5ewGU3VWT4cbGIDLIw",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**JWT Token Payload (Decoded):**

```json
{
  "iss": "https://dev-nmovz0sdbo0nyccf.us.auth0.com/",
  "sub": "8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2@clients",
  "aud": "https://nestjs.auth0.demo.api",
  "iat": 1758040343,
  "exp": 1758126743,
  "gty": "client-credentials",
  "azp": "8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2"
}
```

---

## 2. NestJS Implementation

### 2.1 Project Dependencies

Our NestJS project uses the following key dependencies for Auth0 integration:

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/config": "^4.0.2",
  "@nestjs/core": "^11.0.1",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/platform-express": "^11.0.1",
  "jwks-rsa": "^3.2.0",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1"
}
```

### 2.2 Environment Configuration

Environment variables are stored in `.env` file:

```env
AUTH0_DOMAIN=dev-nmovz0sdbo0nyccf.us.auth0.com
AUTH0_AUDIENCE=https://nestjs.auth0.demo.api
```

### 2.3 JWT Strategy Implementation

The core of our authentication system is the JWT strategy that validates Auth0 tokens:

```typescript
// src/auth/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import * as jwksRsa from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const domain = configService.get<string>("AUTH0_DOMAIN");
    const audience = configService.get<string>("AUTH0_AUDIENCE");

    if (!domain || !audience) {
      throw new Error(
        "AUTH0_DOMAIN and AUTH0_AUDIENCE must be set in environment variables"
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://${domain}/`,
      audience,
      algorithms: ["RS256"],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }) as any,
    });
  }

  validate(payload: any) {
    // You can map/return a user object here; for demo just return the payload
    console.log("JWT Payload received:", payload);
    return payload;
  }
}
```

**Key Features Explained:**

1. **ConfigService Integration**: Uses NestJS ConfigService for secure environment variable access
2. **Token Extraction**: `ExtractJwt.fromAuthHeaderAsBearerToken()` extracts Bearer tokens from Authorization header
3. **Issuer Validation**: Ensures tokens come from our specific Auth0 domain
4. **Audience Validation**: Verifies tokens are intended for our API
5. **Algorithm Specification**: Uses RS256 (RSA with SHA-256) for token verification
6. **JWKS Integration**: `jwks-rsa` automatically fetches public keys from Auth0's JWKS endpoint
7. **Caching & Rate Limiting**: Optimizes performance and prevents abuse

### 2.4 JWT Authentication Guard

Simple guard that leverages Passport's JWT strategy:

```typescript
// src/auth/jwt-auth.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

### 2.5 Application Module Configuration

```typescript
// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./auth/jwt.strategy";
import { AppController } from "./app.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
```

**Configuration Highlights:**

- `ConfigModule.forRoot({ isGlobal: true })`: Makes environment variables globally available
- `JwtStrategy` registered as a provider for dependency injection

### 2.6 Protected API Endpoints

```typescript
// src/app.controller.ts
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller()
export class AppController {
  @Get("public")
  publicRoute() {
    return { message: "Public OK" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("private")
  privateRoute(@Request() req: any) {
    console.log("User from JWT:", req.user);
    return {
      message: "Private OK",
      user: req.user,
    };
  }
}
```

**Endpoint Details:**

- **Public Route** (`/public`): Accessible without authentication
- **Private Route** (`/private`): Protected by `@UseGuards(JwtAuthGuard)`, requires valid JWT token
- **User Context**: Authenticated user information is available in `req.user`

---

## 3. Testing with Bruno

### 3.1 Bruno Collection Setup

Created a Bruno collection to test both public and private endpoints.

**Public Endpoint Test:**

```
meta {
  name: Public
  type: http
  seq: 1
}

get {
  url: http://localhost:3000/public
  body: none
  auth: inherit
}
```

**Private Endpoint Test:**

```
meta {
  name: Private
  type: http
  seq: 3
}

get {
  url: http://localhost:3000/private
  body: none
  auth: bearer
}

auth:bearer {
  token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjloQUNuUzA2czZqOV9yYktaU2VoWSJ9...
}
```

### 3.2 Test Results

**Public Endpoint Test:**
![Bruno Public Test](nestjs-auth0-demo/screenshots/bruno-test-public.png)

**Private Endpoint Test:**
![Bruno Private Test](nestjs-auth0-demo/screenshots/bruno-test-private.png)

**Console Output After Authentication:**
![Console Output](nestjs-auth0-demo/screenshots/console-after-private-test.png)

**Successful Private Route Response:**

```json
{
  "message": "Private OK",
  "user": {
    "iss": "https://dev-nmovz0sdbo0nyccf.us.auth0.com/",
    "sub": "8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2@clients",
    "aud": "https://nestjs.auth0.demo.api",
    "iat": 1758040343,
    "exp": 1758126743,
    "gty": "client-credentials",
    "azp": "8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2"
  }
}
```

---

## 4. Technical Reflection

### 4.1 How does Auth0 handle authentication compared to traditional username/password auth?

**Traditional Username/Password Authentication:**

- **Local Storage**: User credentials stored in application database
- **Password Management**: Application responsible for password hashing, validation, and security
- **Session Management**: Application manages user sessions and tokens
- **Security Burden**: Application must implement security best practices (password policies, brute force protection, etc.)

**Auth0 Authentication:**

- **Delegated Authentication**: Auth0 handles the authentication process entirely
- **Identity as a Service**: Offloads identity management to a specialized provider
- **Multiple Providers**: Supports social logins, enterprise SSO, and traditional credentials
- **Centralized Security**: Auth0 implements industry-standard security practices
- **Token-Based**: Uses JWT tokens for stateless authentication
- **Compliance**: Auth0 handles compliance requirements (GDPR, SOC2, etc.)

**Key Advantages of Auth0:**

1. **Reduced Development Time**: No need to build authentication from scratch
2. **Enhanced Security**: Benefit from Auth0's security expertise and infrastructure
3. **Scalability**: Auth0 handles authentication load and scaling
4. **Flexibility**: Easy to add new authentication methods without code changes
5. **Maintenance**: Auth0 manages updates, security patches, and compliance

### 4.2 What is the role of JWT in API authentication?

**JWT (JSON Web Token) Characteristics:**

- **Self-Contained**: Contains all necessary information about the user/client
- **Stateless**: No need to store session information server-side
- **Digitally Signed**: Ensures token integrity and authenticity
- **Standard Format**: Industry-standard format for secure information transmission

**Role in API Authentication:**

1. **Authentication Proof**: JWT serves as proof that the client has been authenticated
2. **Authorization Context**: Contains claims about what the client is authorized to do
3. **Stateless Sessions**: Eliminates need for server-side session storage
4. **Cross-Service Communication**: Can be used across multiple microservices
5. **Scalability**: Enables horizontal scaling without shared session state

**JWT Structure in Our Implementation:**

```
Header: {
  "alg": "RS256",
  "typ": "JWT",
  "kid": "9hACnS06s6j9_rbKZSehY"
}

Payload: {
  "iss": "https://dev-nmovz0sdbo0nyccf.us.auth0.com/",
  "sub": "8gWspMUHSe54t4r0cYQxeEGX4HBAG2z2@clients",
  "aud": "https://nestjs.auth0.demo.api",
  "iat": 1758040343,
  "exp": 1758126743,
  "gty": "client-credentials"
}
```

### 4.3 How do jwks-rsa and public/private key verification work in Auth0?

**JWKS (JSON Web Key Set):**

- **Purpose**: Provides public keys for JWT signature verification
- **Endpoint**: `https://{domain}/.well-known/jwks.json`
- **Dynamic**: Keys can be rotated without application changes
- **Security**: Only public keys are exposed, private keys remain with Auth0

**Public/Private Key Cryptography in JWT:**

1. **Token Signing (Auth0 Side)**:

   - Auth0 uses its **private key** to sign JWT tokens
   - Private key never leaves Auth0's infrastructure
   - Signature proves token authenticity and integrity

2. **Token Verification (Application Side)**:
   - Application fetches **public key** from JWKS endpoint
   - Uses public key to verify JWT signature
   - Successful verification proves token was signed by Auth0

**jwks-rsa Library Benefits:**

```typescript
secretOrKeyProvider: jwksRsa.passportJwtSecret({
  cache: true, // Cache keys for performance
  rateLimit: true, // Prevent abuse
  jwksRequestsPerMinute: 5, // Limit JWKS requests
  jwksUri: `https://${domain}/.well-known/jwks.json`,
});
```

- **Automatic Key Fetching**: Retrieves appropriate public key based on `kid` (Key ID)
- **Caching**: Reduces latency and JWKS endpoint load
- **Rate Limiting**: Prevents abuse and excessive requests
- **Key Rotation Support**: Automatically handles Auth0 key rotation

### 4.4 How would you protect an API route so that only authenticated users can access it?

**Implementation Steps:**

1. **Install Required Dependencies**:

```bash
npm install @nestjs/passport passport passport-jwt jwks-rsa @nestjs/config
```

2. **Configure JWT Strategy**:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://${domain}/`,
      audience: audience,
      algorithms: ["RS256"],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
    });
  }
}
```

3. **Create Authentication Guard**:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

4. **Protect Routes with Guard**:

```typescript
@Controller("api")
export class ApiController {
  // Public route - no protection
  @Get("public")
  publicEndpoint() {
    return { message: "Public access" };
  }

  // Protected route - requires authentication
  @UseGuards(JwtAuthGuard)
  @Get("protected")
  protectedEndpoint(@Request() req) {
    return {
      message: "Protected access",
      user: req.user,
    };
  }

  // Multiple guards can be combined
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin")
  adminEndpoint(@Request() req) {
    return { message: "Admin only access" };
  }
}
```

5. **Global Protection (Optional)**:

```typescript
// Protect all routes by default
app.useGlobalGuards(new JwtAuthGuard());

// Then use @Public() decorator for public routes
@Public()
@Get('public')
publicRoute() {
  return { message: 'Public' };
}
```

**Advanced Protection Patterns:**

1. **Role-Based Access Control (RBAC)**:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@Get('admin-panel')
adminPanel() {
  return { message: 'Admin/Moderator access' };
}
```

2. **Custom Permission Checks**:

```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('read:users', 'write:users')
@Get('users')
getUsers() {
  return this.userService.findAll();
}
```

3. **Resource-Based Protection**:

```typescript
@UseGuards(JwtAuthGuard, ResourceOwnerGuard)
@Get('users/:id')
getUser(@Param('id') id: string, @Request() req) {
  // Only allow access if user owns the resource
  return this.userService.findOne(id);
}
```

**Security Best Practices:**

1. **Token Validation**: Always validate token signature, expiration, issuer, and audience
2. **HTTPS Only**: Use HTTPS in production to protect tokens in transit
3. **Token Storage**: Store tokens securely on client side (avoid localStorage for sensitive apps)
4. **Token Refresh**: Implement token refresh mechanisms for long-lived applications
5. **Error Handling**: Don't expose sensitive information in authentication errors
6. **Logging**: Log authentication attempts and failures for security monitoring

---

## 🎉 Conclusion

This demonstration successfully showcases how to integrate Auth0 with NestJS for secure API authentication. The implementation provides:

- **Robust Authentication**: Using industry-standard JWT tokens and Auth0's security infrastructure
- **Scalable Architecture**: Stateless authentication suitable for microservices
- **Developer Experience**: Clean, maintainable code with proper separation of concerns
- **Security Best Practices**: Proper token validation, key management, and error handling

The combination of Auth0's identity-as-a-service platform with NestJS's powerful guard system creates a secure, scalable, and maintainable authentication solution for modern web applications.
