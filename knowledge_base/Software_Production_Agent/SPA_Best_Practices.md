
# S.P.A. Best Practices Guide

## Table of Contents
1. [Code Quality Standards](#code-quality-standards)
2. [Security Best Practices](#security-best-practices)
3. [Performance Optimization](#performance-optimization)
4. [Scaling Strategies](#scaling-strategies)
5. [Development Workflow](#development-workflow)
6. [Testing Standards](#testing-standards)

## Code Quality Standards

### Code Style and Formatting

**ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@spa-system/eslint-config',
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
```

**Prettier Configuration**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**TypeScript Standards**
```typescript
// Use strict type definitions
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Prefer type unions over enums when appropriate
type Status = 'pending' | 'approved' | 'rejected';

// Use generic constraints
function processData<T extends { id: string }>(items: T[]): T[] {
  return items.filter(item => item.id);
}

// Avoid 'any' - use unknown or specific types
function parseJson(json: string): unknown {
  return JSON.parse(json);
}
```

### Documentation Standards

**Code Comments**
```typescript
/**
 * Calculates the total price including tax and discounts
 * @param basePrice - The original price before modifications
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param discountPercent - Discount percentage (0-100)
 * @returns The final calculated price
 * @throws {Error} When basePrice is negative
 */
function calculateTotalPrice(
  basePrice: number,
  taxRate: number,
  discountPercent: number = 0
): number {
  if (basePrice < 0) {
    throw new Error('Base price cannot be negative');
  }
  
  const discountAmount = basePrice * (discountPercent / 100);
  const discountedPrice = basePrice - discountAmount;
  return discountedPrice * (1 + taxRate);
}
```

**README Standards**
```markdown
# Project Name

## Overview
Brief description of what the project does and its main purpose.

## Quick Start
```bash
npm install
npm run dev
```

## Architecture
- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Deployment**: Netlify + Railway

## Development
### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Copy environment: `cp .env.example .env`
4. Start development: `npm run dev`

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)
```

### File Organization

**Project Structure**
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API and external service calls
├── utils/               # Pure utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
├── styles/              # Global styles and themes
└── __tests__/           # Test files
```

**Naming Conventions**
```typescript
// Files: kebab-case
user-profile.component.tsx
api-client.service.ts
form-validation.utils.ts

// Components: PascalCase
export const UserProfile: React.FC = () => {};

// Functions: camelCase
export const validateEmail = (email: string): boolean => {};

// Constants: SCREAMING_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';

// Types/Interfaces: PascalCase
interface UserProfile {
  id: string;
  name: string;
}
```

## Security Best Practices

### Authentication and Authorization

**JWT Implementation**
```typescript
// Secure JWT handling
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      this.JWT_SECRET,
      { expiresIn: '24h', algorithm: 'HS256' }
    );
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
  }
}
```

**Input Validation**
```typescript
import { z } from 'zod';

// Define schemas for validation
const UserRegistrationSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
  age: z.number().int().min(13).max(120)
});

// Validate input
export const validateUserRegistration = (data: unknown) => {
  return UserRegistrationSchema.parse(data);
};

// Sanitize HTML input
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

### Data Protection

**Environment Variables**
```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_SALT_ROUNDS=12

# External APIs
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

**Secure Headers**
```typescript
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### API Security

**Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per window
  message: 'Too many requests',
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);
```

## Performance Optimization

### Frontend Optimization

**React Performance**
```typescript
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// Memoize expensive components
const ExpensiveComponent = memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return data.items.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data.items]);

  const handleClick = useCallback((id: string) => {
    // Handle click logic
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleClick} />
      ))}
    </div>
  );
});

// Lazy load components
const LazyDashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyDashboard />
    </Suspense>
  );
}
```

**Bundle Optimization**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

### Backend Optimization

**Database Optimization**
```sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Composite indexes for complex queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON users(id) WHERE active = true;
```

**Caching Strategy**
```typescript
import Redis from 'ioredis';

class CacheService {
  private redis = new Redis(process.env.REDIS_URL);

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in service
export class UserService {
  private cache = new CacheService();

  async getUser(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    let user = await this.cache.get<User>(cacheKey);
    
    if (!user) {
      user = await this.userRepository.findById(id);
      await this.cache.set(cacheKey, user, 1800); // 30 minutes
    }
    
    return user;
  }
}
```

## Scaling Strategies

### Horizontal Scaling

**Microservices Architecture**
```typescript
// Service discovery pattern
interface ServiceRegistry {
  register(serviceName: string, instance: ServiceInstance): void;
  discover(serviceName: string): ServiceInstance[];
  healthCheck(serviceName: string): Promise<boolean>;
}

class ApiGateway {
  constructor(private registry: ServiceRegistry) {}

  async route(request: Request): Promise<Response> {
    const serviceName = this.extractServiceName(request.path);
    const instances = this.registry.discover(serviceName);
    const healthyInstance = await this.selectHealthyInstance(instances);
    
    return this.forwardRequest(request, healthyInstance);
  }

  private async selectHealthyInstance(instances: ServiceInstance[]): Promise<ServiceInstance> {
    // Load balancing logic (round-robin, least connections, etc.)
    return instances[Math.floor(Math.random() * instances.length)];
  }
}
```

**Database Scaling**
```typescript
// Read/Write splitting
class DatabaseManager {
  private writeDb: Database;
  private readDbs: Database[];

  async write(query: string, params: any[]): Promise<any> {
    return this.writeDb.query(query, params);
  }

  async read(query: string, params: any[]): Promise<any> {
    const readDb = this.selectReadDatabase();
    return readDb.query(query, params);
  }

  private selectReadDatabase(): Database {
    // Round-robin or least connections
    return this.readDbs[Math.floor(Math.random() * this.readDbs.length)];
  }
}
```

### Vertical Scaling

**Resource Optimization**
```typescript
// Memory management
class MemoryEfficientProcessor {
  async processLargeDataset(data: AsyncIterable<DataItem>): Promise<void> {
    const batchSize = 1000;
    let batch: DataItem[] = [];

    for await (const item of data) {
      batch.push(item);
      
      if (batch.length >= batchSize) {
        await this.processBatch(batch);
        batch = []; // Clear memory
      }
    }

    if (batch.length > 0) {
      await this.processBatch(batch);
    }
  }

  private async processBatch(batch: DataItem[]): Promise<void> {
    // Process batch and release memory
    await Promise.all(batch.map(item => this.processItem(item)));
  }
}
```

## Development Workflow

### Git Workflow

**Branch Strategy**
```bash
# Feature development
git checkout -b feature/user-authentication
git commit -m "feat: implement JWT authentication"
git push origin feature/user-authentication

# Create pull request
gh pr create --title "Add user authentication" --body "Implements JWT-based auth system"

# Code review and merge
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

**Commit Message Convention**
```bash
# Format: type(scope): description
feat(auth): add JWT token validation
fix(api): resolve user creation bug
docs(readme): update installation instructions
test(auth): add unit tests for login flow
refactor(db): optimize user query performance
style(ui): fix button alignment issues
chore(deps): update dependencies to latest versions
```

### Code Review Process

**Review Checklist**
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Error handling implemented
- [ ] Logging added where appropriate

**Review Template**
```markdown
## Summary
Brief description of changes

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Security
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] No sensitive data exposed

## Performance
- [ ] No performance regressions
- [ ] Database queries optimized
- [ ] Caching considered where appropriate
```

## Testing Standards

### Unit Testing

**Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts']
};
```

**Test Examples**
```typescript
// user.service.test.ts
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';

jest.mock('../user.repository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };
      const expectedUser = { id: '1', ...userData };
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error for invalid email', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'securePassword123'
      };

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Invalid email format');
    });
  });
});
```

### Integration Testing

**API Testing**
```typescript
// api.integration.test.ts
import request from 'supertest';
import { app } from '../app';
import { setupTestDatabase, cleanupTestDatabase } from '../test-utils';

describe('User API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        name: userData.name
      });
      expect(response.body.password).toBeUndefined();
    });
  });
});
```

### End-to-End Testing

**Playwright Configuration**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
```

**E2E Test Example**
```typescript
// e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should register new user successfully', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[data-testid=email-input]', 'test@example.com');
    await page.fill('[data-testid=name-input]', 'Test User');
    await page.fill('[data-testid=password-input]', 'securePassword123');
    await page.fill('[data-testid=confirm-password-input]', 'securePassword123');

    await page.click('[data-testid=register-button]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=welcome-message]'))
      .toContainText('Welcome, Test User');
  });

  test('should show validation errors for invalid data', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[data-testid=email-input]', 'invalid-email');
    await page.click('[data-testid=register-button]');

    await expect(page.locator('[data-testid=email-error]'))
      .toContainText('Please enter a valid email address');
  });
});
```

These comprehensive best practices ensure your S.P.A. projects maintain the highest standards of quality, security, and performance while enabling rapid development and reliable scaling.
