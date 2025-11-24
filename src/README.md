# Source Directory Structure

This directory contains all source code for the application, organized following Next.js App Router conventions and Material Design principles.

## Directory Overview

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/              # Utility functions and helpers
├── types/            # Shared TypeScript types and interfaces
├── hooks/            # Custom React hooks
├── constants/        # Application constants and configuration
└── styles/           # Global styles and Material Design theme
```

## Directory Details

### `/app`
Next.js App Router directory. Contains:
- Page components (route files)
- Layout components
- Route groups and parallel routes
- API routes

**Convention**: Use file-based routing. Each folder represents a route segment.

### `/components`
Reusable React components built with TypeScript and Material Design.

**Structure**:
```
components/
  ComponentName/
    ComponentName.tsx    # Main component
    types.ts            # Component-specific types
    ComponentName.module.css  # Styles (if needed)
```

**Guidelines**:
- Use PascalCase for component names
- Export components as default exports
- Co-locate types with components when component-specific
- Follow Material Design principles

### `/lib`
Utility functions, API clients, and shared business logic.

**Structure**:
```
lib/
  api/                 # API client and endpoints
  utils/               # Helper functions
  validators/          # Validation utilities
```

**Guidelines**:
- Use `.ts` extension (not `.tsx`)
- Export functions as named exports
- Keep functions pure and testable

### `/types`
Shared TypeScript types, interfaces, and type definitions used across multiple components.

**Guidelines**:
- Feature-specific types can be co-located with components
- Use descriptive file names: `user.types.ts`, `api.types.ts`
- Re-export from `index.ts` for convenience

### `/hooks`
Custom React hooks for shared logic.

**Guidelines**:
- One hook per file
- File name starts with `use` prefix
- Export as named exports

### `/constants`
Application constants, configuration values, and enums.

**Guidelines**:
- Group related constants together
- Use TypeScript `const` assertions for type safety
- Export as named exports

### `/styles`
Global styles, Material Design theme configuration, and CSS variables.

**Guidelines**:
- Define Material Design tokens as CSS custom properties
- Theme configuration will be added when Material UI is integrated
- Keep global styles minimal

## Import Paths

Use absolute imports with the `@/` prefix:

```typescript
import Button from '@/components/Button/Button';
import { formatDate } from '@/lib/utils/format';
import type { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
```

## Development Rules

All code must follow:
1. **TypeScript**: Strict typing, no `any` types
2. **Next.js**: App Router conventions and best practices
3. **Material Design**: Design principles and accessibility standards

See `.cursor/rules/common.mdc` for detailed development guidelines.

