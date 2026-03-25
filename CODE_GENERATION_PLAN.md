# InkGlass AI - Code Generation Tool Replacement Plan

## Overview
Replace NVIDIA Nemotron AI-based code generation with template-based functional code generation.

## Strategy
Use Handlebars templates to generate boilerplate code for common patterns.

## Tech Stack
- **handlebars**: Template engine
- **prettier**: Code formatting
- **Custom templates**: Pre-built code patterns

## Template Categories

### 1. Frontend Templates
- React Component (JS/TS)
- Next.js Page
- Custom Hook
- API Client
- Form Component

### 2. Backend Templates
- Express Route
- Express Controller
- MongoDB Model
- REST API Endpoint
- Middleware

### 3. Full-Stack Templates
- CRUD Module (Model + Route + Controller)
- API Resource
- Authentication Flow

## Implementation Steps

1. Install dependencies: `npm install handlebars prettier`
2. Create template library in `src/lib/code-templates/`
3. Create template files for each pattern
4. Create utility functions to generate code
5. Update `/code` page to use template system
6. Add language-specific formatting

## File Structure
```
src/lib/code-templates/
├── templates/
│   ├── react/
│   │   ├── component.hbs
│   │   ├── hook.hbs
│   │   └── page.hbs
│   ├── nextjs/
│   │   └── api-route.hbs
│   ├── express/
│   │   ├── route.hbs
│   │   └── controller.hbs
│   └── common/
│       └── function.hbs
├── generator.ts
└── index.ts
```

## Supported Languages
- JavaScript
- TypeScript
- Python
- Go
- Rust

## Features
1. Language selector
2. Template type selector
3. Name/input customization
4. Copy to clipboard
5. Download as file
6. Preview with syntax highlighting
