## 1. Architecture design

```mermaid
graph TD
    A[User Browser] --> B[React Frontend Application]
    B --> C[Better Auth Client SDK]
    C --> D[Express Backend with Better Auth]
    D --> E[MySQL Database]
    D --> F[Prisma ORM]

    subgraph "Frontend Layer"
        B
        C
    end

    subgraph "Backend Layer"
        D
        F
    end

    subgraph "Data Layer"
        E
    end
```

## 2. Technology Description

- **Frontend**: React@18 + TypeScript + Vite + TailwindCSS
- **Initialization Tool**: vite-init
- **UI Components**: shadcn/ui + Radix UI
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: Better Auth Client SDK
- **Backend**: Express.js with Better Auth
- **Database**: MySQL (via Prisma)

## 3. Route definitions

| Route | Purpose |
|-------|---------|
| / | Login page, main entry point for unauthenticated users |
| /login | Login page with username/password form |
| /register | User registration page |
| /home | User home page, displays user profile information |
| /protected | Example protected route requiring authentication |

## 4. API definitions

### 4.1 Authentication APIs (via Better Auth)

**User Login**
```
POST /api/auth/sign-in/username-password
```

Request:
| Param Name| Param Type  | isRequired  | Description |
|-----------|-------------|-------------|-------------|
| username  | string      | true        | The username of user |
| password  | string      | true        | User password |

Response:
| Param Name| Param Type  | Description |
|-----------|-------------|-------------|
| token     | string      | JWT authentication token |
| user      | object      | User data object |

**User Registration**
```
POST /api/auth/sign-up
```

Request:
| Param Name| Param Type  | isRequired  | Description |
|-----------|-------------|-------------|-------------|
| username  | string      | true        | The desired username |
| password  | string      | true        | User password |

**Get Session**
```
GET /api/auth/session
```

Response:
| Param Name| Param Type  | Description |
|-----------|-------------|-------------|
| session   | object      | Current user session data |
| user      | object      | Current user information |

## 5. Frontend architecture

```mermaid
graph TD
    A[App Component] --> B[Router]
    B --> C[Login Page]
    B --> D[Register Page]
    B --> E[User Home Page]
    B --> F[Protected Route Wrapper]
    
    C --> G[Auth Form Component]
    D --> G
    E --> H[User Info Component]
    E --> I[Navigation Component]
    
    G --> J[Better Auth Client]
    H --> J
    
    subgraph "Components"
        G
        H
        I
        F
    end
    
    subgraph "Auth Service"
        J
    end
```

## 6. Data model

### 6.1 User model (via Better Auth)
```mermaid
erDiagram
    USER {
        string id PK
        string username UK
        string email UK
        string password_hash
        boolean emailVerified
        datetime createdAt
        datetime updatedAt
    }
```

### 6.2 Better Auth Database Schema
Better Auth automatically manages the following tables:
- **users**: Core user information
- **sessions**: User session data
- **accounts**: Account linking for OAuth
- **verifications**: Email verification tokens

## 7. Security Considerations

- **HTTPS**: All communications should be encrypted
- **JWT Tokens**: Secure token storage and management
- **CSRF Protection**: Implemented via Better Auth
- **Rate Limiting**: Applied to authentication endpoints
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure session handling with automatic expiration

## 8. Development Setup

1. **Frontend Development**
   ```bash
   cd /Users/wepie/WorkSpace/Self/prefer-node/apps/server-express-better-auth/web
   npm install
   npm run dev
   ```

2. **Environment Variables**
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_AUTH_COOKIE_NAME=better-auth-session
   ```

3. **Build Process**
   ```bash
   npm run build
  