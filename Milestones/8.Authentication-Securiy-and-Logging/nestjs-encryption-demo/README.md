# 🔐 NestJS TypeORM Encrypted Demo

A comprehensive demonstration of field-level data encryption using `typeorm-encrypted` in a NestJS application with PostgreSQL.

## 🎯 Purpose

This project demonstrates:

- **Field-level encryption** using `typeorm-encrypted`
- **Double encryption strategy** (database + application level)
- **Key management** best practices
- **Comparison** between encrypted and plain data fields
- **Real-world scenarios** for sensitive data protection

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client API    │────│   NestJS App     │────│   PostgreSQL    │
│   (Decrypted)   │    │  (Encryption     │    │   (Encrypted    │
│                 │    │   Transform)     │    │    Storage)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Start Database (Docker)

```bash
npm run docker:up
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Application

```bash
npm run start:dev
```

### 4. Access Services

- **API**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@demo.com / admin123)

## 🧪 Testing Scenarios

### Scenario 1: Create Encrypted User Data

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@sensitive.com",
    "ssn": "123-45-6789",
    "phoneNumber": "555-0123",
    "sensitiveNotes": "Has access to classified information"
  }'
```

### Scenario 2: View Decrypted Data (API Response)

```bash
curl http://localhost:3000/users
```

### Scenario 3: View Encrypted Data (Raw Database)

```bash
curl http://localhost:3000/users/raw
```

## 🔍 Database Inspection

### Connect to pgAdmin

1. Open http://localhost:5050
2. Login: `admin@demo.com` / `admin123`
3. Add Server:
   - Host: `postgres`
   - Port: `5432`
   - Username: `demo_user`
   - Password: `demo_password`
   - Database: `encryption_demo`

### Compare Fields

- **Encrypted Fields**: `email`, `ssn`, `sensitiveNotes` (encrypted in DB)
- **Plain Fields**: `name`, `phoneNumber` (readable in DB)

## 📊 Field Comparison

| Field            | Encrypted | Visible in DB | API Response  |
| ---------------- | --------- | ------------- | ------------- |
| `name`           | ❌        | ✅ Plain text | ✅ Plain text |
| `email`          | ✅        | ❌ Encrypted  | ✅ Decrypted  |
| `ssn`            | ✅        | ❌ Encrypted  | ✅ Decrypted  |
| `phoneNumber`    | ❌        | ✅ Plain text | ✅ Plain text |
| `sensitiveNotes` | ✅        | ❌ Encrypted  | ✅ Decrypted  |

## 🔐 Encryption Details

### Algorithm Configuration

```typescript
const encryptionTransformer = new EncryptionTransformer({
  key: process.env.ENCRYPTION_KEY,
  algorithm: "aes-256-cbc",
  ivLength: 16,
});
```

### Key Management

- **Development**: 32-character hex key in `.env`
- **Production**: Use secure key management (AWS KMS, Azure Key Vault, etc.)
- **Rotation**: Change `ENCRYPTION_KEY` and migrate data

## 🛡️ Security Considerations

### ✅ Benefits

- **Defense in Depth**: Protection even if database is compromised
- **Selective Encryption**: Only sensitive fields are encrypted
- **Transparent**: Application code remains clean

### ⚠️ Trade-offs

- **Performance**: Encryption/decryption overhead
- **Searchability**: Cannot search encrypted fields directly
- **Key Management**: Critical security dependency
- **Storage**: Encrypted data requires more space

## 📋 API Endpoints

### Create User

```http
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "ssn": "987-65-4321",
  "phoneNumber": "555-9876",
  "sensitiveNotes": "Department manager with budget access"
}
```

### Get All Users (Decrypted)

```http
GET /users
```

### Get Raw Database Values (Encrypted)

```http
GET /users/raw
```

### Get Single User

```http
GET /users/1
```

### Delete User

```http
DELETE /users/1
```

## 🐳 Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Reset database
npm run docker:down && npm run docker:up
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build for production
npm run build

# Start production
npm run start:prod
```

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=demo_user
DB_PASSWORD=demo_password
DB_NAME=encryption_demo

# Encryption (32-character hex for AES-256)
ENCRYPTION_KEY=2b5f7c8e9a1d3f6b8c4e7a2d5f8b1c4e7a2d5f8b1c4e7a2d5f8b1c4e7a2d5f8b

# Application
PORT=3000
NODE_ENV=development
```

## 🎯 Learning Objectives

By exploring this demo, you will understand:

1. **Why double encryption matters** - Compare encrypted vs plain fields
2. **How typeorm-encrypted works** - See entity definitions and transformers
3. **Key management practices** - Environment-based configuration
4. **Performance implications** - Compare query performance
5. **Security trade-offs** - Database vs application-level encryption

## 📸 Screenshot Opportunities

Perfect for documentation and evidence:

1. **API Responses** - Decrypted data in JSON format
2. **pgAdmin Interface** - Encrypted data in database tables
3. **Raw vs Processed** - Side-by-side comparison
4. **Docker Containers** - Services running
5. **Performance Metrics** - Query execution times

---

**Security Note**: This is a demonstration project. In production, use proper key management, secure connections, and follow your organization's security policies.
