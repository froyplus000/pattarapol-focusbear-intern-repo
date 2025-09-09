# 🔐 NestJS Security Demo

A comprehensive demonstration of security best practices in NestJS applications using the Fastify adapter.

## 🎯 What This Demo Teaches

This project demonstrates essential security practices for protecting NestJS applications from common vulnerabilities:

### 🛡️ Security Features Implemented

1. **HTTP Security Headers** (`@fastify/helmet`)
   - Content Security Policy (CSP)
   - HTTP Strict Transport Security (HSTS)
   - X-Frame-Options (clickjacking protection)
   - X-Content-Type-Options (MIME sniffing protection)

2. **Rate Limiting** (`@fastify/rate-limit`)
   - Prevents brute force attacks
   - Limits requests per IP address
   - Custom error messages with retry information

3. **Input Validation** (class-validator + ValidationPipe)
   - Validates incoming request data
   - Strips unknown fields (whitelist mode)
   - Prevents injection attacks through sanitized inputs

4. **API Key Authentication** (Custom Guard)
   - Protects sensitive endpoints
   - Secure key comparison
   - Environment-based configuration

5. **CORS Protection**
   - Restricts cross-origin requests
   - Configurable allowed origins
   - Credential support control

6. **Environment Validation** (Joi schema)
   - Validates configuration at startup
   - Enforces security requirements (key length, URL format)
   - Fails fast on misconfiguration

## 📁 Project Structure

```
src/
├── main.ts              # Application bootstrap with security middleware
├── app.module.ts        # Root module with environment validation
├── public/              # Unsecured public endpoints
│   ├── public.controller.ts  # /health and /echo routes
│   └── public.module.ts
└── security/            # Secured endpoints
    ├── api-key.guard.ts      # API key authentication guard
    ├── security.controller.ts # Protected /secret route
    └── security.module.ts
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your values (API key must be 32+ characters)
```

### 2. Start the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run start:prod
```

The server will start on `http://localhost:3000`

## 🧪 Testing the Security Features

### Public Endpoints (No Authentication Required)

```bash
# Health check
curl http://localhost:3000/health

# Input validation demo (try with invalid data)
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Security Demo!"}'

# Test validation failure
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "", "extraField": "should be stripped"}'
```

### Protected Endpoint (API Key Required)

```bash
# Access protected route with correct API key
curl -H "x-api-key: demo-api-key-32-chars-minimum-length-required-for-security" \
  http://localhost:3000/secret

# Test authentication failure
curl http://localhost:3000/secret
```

### Security Headers Demo

```bash
# Check security headers in response
curl -i http://localhost:3000/health
# Look for: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security
```

### Rate Limiting Demo

```bash
# Test rate limiting (default: 100 requests per minute)
for i in {1..5}; do
  curl -w "Status: %{http_code}, Time: %{time_total}s\n" \
    http://localhost:3000/health
  sleep 1
done
```

## 🔍 Understanding the Security Implementation

### 1. HTTP Security Headers (`src/main.ts`)

```typescript
await app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only load resources from same origin
      scriptSrc: ["'self'"], // No inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow some inline styles
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year HSTS
    includeSubDomains: true, // Apply to all subdomains
  },
});
```

### 2. Rate Limiting (`src/main.ts`)

```typescript
await app.register(fastifyRateLimit, {
  max: 100, // 100 requests
  timeWindow: '1 minute', // Per minute per IP
  errorResponseBuilder: function (request, context) {
    return {
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds.`,
    };
  },
});
```

### 3. Input Validation (`src/public/public.controller.ts`)

```typescript
class EchoDto {
  @IsString()
  @Length(1, 200)
  message: string;
}

// ValidationPipe automatically:
// - Validates against DTO schema
// - Strips unknown properties (whitelist: true)
// - Transforms data types
// - Rejects invalid requests
```

### 4. API Key Guard (`src/security/api-key.guard.ts`)

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<FastifyRequest>();
  const apiKey = req.headers['x-api-key'];
  const expectedKey = this.configService.get<string>('API_KEY');

  if (!apiKey || apiKey !== expectedKey) {
    throw new UnauthorizedException('Invalid API key');
  }
  return true;
}
```

## 🏆 Security Best Practices Demonstrated

### ✅ Input Validation & Sanitization

- **Problem**: Injection attacks, data corruption
- **Solution**: Use DTOs with class-validator decorators
- **Implementation**: `ValidationPipe` with `whitelist: true`

### ✅ Authentication & Authorization

- **Problem**: Unauthorized access to sensitive endpoints
- **Solution**: Custom guards that validate API keys/tokens
- **Implementation**: `ApiKeyGuard` with environment-based keys

### ✅ Rate Limiting

- **Problem**: Brute force attacks, DoS attempts
- **Solution**: Limit requests per IP address
- **Implementation**: Fastify rate limiting middleware

### ✅ Secure HTTP Headers

- **Problem**: XSS, clickjacking, MIME sniffing attacks
- **Solution**: Security headers via Helmet
- **Implementation**: CSP, HSTS, X-Frame-Options, etc.

### ✅ CORS Protection

- **Problem**: Unauthorized cross-origin requests
- **Solution**: Restrict allowed origins
- **Implementation**: Environment-configurable origin whitelist

### ✅ Environment Security

- **Problem**: Misconfiguration, weak secrets
- **Solution**: Validate config at startup
- **Implementation**: Joi schema validation

## 🔐 Production Security Checklist

### Environment & Secrets Management

- [ ] Use a dedicated secret manager (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Never commit `.env` files to version control
- [ ] Use strong, randomly generated API keys (32+ characters)
- [ ] Rotate secrets regularly
- [ ] Set `NODE_ENV=production`

### Additional Security Measures

- [ ] Enable HTTPS/TLS in production
- [ ] Use a reverse proxy (nginx, Cloudflare) for additional protection
- [ ] Implement proper logging and monitoring
- [ ] Set up intrusion detection systems
- [ ] Regular security audits and dependency updates
- [ ] Database query parameterization (prevent SQL injection)
- [ ] Implement proper session management for user authentication

### Configuration Hardening

- [ ] Tighten CORS origins to specific domains
- [ ] Adjust rate limits based on actual usage patterns
- [ ] Configure CSP headers for your specific frontend requirements
- [ ] Enable request/response logging for security monitoring
- [ ] Set up proper error handling (don't leak sensitive info)

## 📚 Learning Resources

### Common Web Vulnerabilities (OWASP Top 10)

1. **Injection** → Input validation & parameterized queries
2. **Broken Authentication** → Strong session management & MFA
3. **Sensitive Data Exposure** → Encryption & proper data handling
4. **XML External Entities (XXE)** → Disable XML external entity processing
5. **Broken Access Control** → Proper authorization checks
6. **Security Misconfiguration** → Secure defaults & configuration management
7. **Cross-Site Scripting (XSS)** → Input sanitization & CSP headers
8. **Insecure Deserialization** → Validate serialized data
9. **Using Components with Known Vulnerabilities** → Regular dependency updates
10. **Insufficient Logging & Monitoring** → Comprehensive security logging

### NestJS Security Documentation

- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

## 🧪 Tests

```bash
# Run unit tests
npm run test

# Run e2e security tests
npm run test:e2e

# Check test coverage
npm run test:cov
```

## 💡 Next Steps for Learning

### Try These Exercises:

1. **Add JWT Authentication**: Replace API key with JWT tokens
2. **Implement Role-Based Access**: Add user roles and permissions
3. **Add Request Logging**: Log all API requests for security monitoring
4. **Database Security**: Add parameterized queries and connection encryption
5. **File Upload Security**: Implement secure file upload with validation

### Explore Advanced Topics:

- OAuth 2.0 / OpenID Connect integration
- Two-factor authentication (2FA)
- Session management and CSRF protection
- SQL injection prevention
- GraphQL security considerations

## 🔗 Useful Resources

### Security References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Most critical web security risks
- [NestJS Security Docs](https://docs.nestjs.com/security/authentication) - Official security guide
- [Helmet.js](https://helmetjs.github.io/) - Security headers documentation
- [class-validator](https://github.com/typestack/class-validator) - Input validation library

### NestJS Resources

- [NestJS Documentation](https://docs.nestjs.com) - Complete framework guide
- [NestJS Discord](https://discord.gg/G7Qnnhy) - Community support
- [NestJS Courses](https://courses.nestjs.com/) - Official video courses

---

## ⚠️ Important Security Notes

> **🚨 This is a demo project for learning purposes.**  
> **Do not use in production without proper security hardening!**

### Key Reminders:

- Use proper secret management in production (not `.env` files)
- Implement comprehensive logging and monitoring
- Regular security audits and dependency updates
- Follow the principle of least privilege
- Always validate and sanitize user inputs
- Use HTTPS in production environments

---

_Built with ❤️ for learning NestJS security best practices_
