# Production Readiness Review (Express + TypeScript + Prisma + JWT)

This review focuses on structure, validation, and security, and includes what was already improved in code plus high-impact next steps.

## What was improved now

1. **Input validation hardening (auth + tasks)**
   - Added stricter checks for required fields and types.
   - Normalized email (`trim + lowercase`) and string inputs.
   - Added password and name length boundaries.
   - Added boolean/type checks for task updates.

2. **Pagination controls**
   - Added max page size guard (`MAX_PAGE_SIZE = 100`) to avoid abusive large queries.

3. **Security baseline improvements**
   - Added security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
   - Disabled `x-powered-by`.
   - Added JSON request body size limit (`1mb`).
   - Strengthened bcrypt work factor (10 -> 12).

4. **JWT verification hardening**
   - Introduced issuer and audience claims on JWT sign/verify.
   - Improved malformed header and token-expired error handling.

5. **Environment configuration validation**
   - Added centralized env config with required variable checks.
   - Switched server bootstrapping to use validated env values.

6. **Task CRUD completeness**
   - Added missing delete endpoint (`DELETE /tasks/:id`) and service authorization checks.

## Recommended next steps (high priority)

### 1) Structure
- Split by feature modules (`auth`, `tasks`, `users`) with each containing:
  - `controller.ts`
  - `service.ts`
  - `repository.ts` (Prisma access)
  - `schema.ts` (validation)
  - `route.ts`
- Add a dedicated `config/` layer for CORS, JWT, DB, and logging setup.
- Create `constants/error-codes.ts` to avoid stringly-typed error mapping.

### 2) Validation
- Migrate to schema-based validation (e.g., `zod`) at route boundaries.
- Return a consistent 422 validation payload:
  - `code`, `message`, `fields[]`
- Validate path/query values (UUID, positive int, enums) with strict bounds.

### 3) Security
- Add rate limiting to `/auth/login` and `/auth/register`.
- Add account lockout or progressive delay for repeated failed logins.
- Rotate JWT secret via key versioning (`kid`) and support refresh tokens.
- Move JWT out of response body if relying on secure cookies.
- Add CSRF mitigation if cookie auth is used cross-site.
- Add request logging with PII redaction.

### 4) Data & Prisma
- Add DB index for task listing use-case:
  - `@@index([userId, createdAt])`
  - potentially `@@index([userId, status, createdAt])`
- Add migration workflow checks in CI (`prisma migrate deploy`).

### 5) API quality
- Add `GET /health` and `GET /ready` endpoints.
- Version APIs (`/api/v1`).
- Add OpenAPI spec and contract tests.

### 6) Delivery/Operations
- Add tests:
  - unit (services)
  - integration (auth/tasks)
  - authz tests (cross-user access denial)
- Add CI pipeline:
  - typecheck, test, build, prisma format/validate
- Add structured logger (e.g., pino) and correlation IDs.

## Suggested target architecture (lean)
- `src/modules/auth/*`
- `src/modules/tasks/*`
- `src/shared/{errors,config,middleware,types,utils}/*`
- `src/server.ts` (create app)
- `src/index.ts` (start listener)

This keeps business logic testable and request concerns isolated.
