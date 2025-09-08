# Overview

FuSteps is a multi-role career development platform built with React, TypeScript, and Node.js. The application connects students, mentors, alumni, employers, and administrators in a comprehensive career guidance ecosystem. The platform features role-based dashboards, user authentication, onboarding flows, and a modern UI built with shadcn/ui components and Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing with role-based dashboard navigation
- **State Management**: React Context API for authentication state and TanStack Query for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Component Structure**: Modular components organized by feature (auth, landing, onboarding, layouts)

## Backend Architecture
The backend follows an Express.js server structure:

- **Server Framework**: Express.js with TypeScript for API endpoints and middleware
- **Route Organization**: Centralized route registration with `/api` prefix for all API endpoints
- **Storage Layer**: Abstracted storage interface with in-memory implementation (easily replaceable)
- **Development Setup**: Vite integration for development with hot module replacement

## Authentication & Authorization
Role-based authentication system supporting five user types:

- **User Roles**: Student, Mentor, Alumni, Employer, Admin
- **Auth Flow**: Email/password authentication with role selection during registration
- **Onboarding**: Custom 3-step onboarding flow specifically for students
- **Dashboard Routing**: Automatic redirection to role-specific dashboards after login

## UI/UX Design System
Consistent design system with custom color palette:

- **Typography**: Inter and Poppins font families for readability
- **Color Scheme**: Custom ink (dark), sun (yellow), leaf (green), slate palettes
- **Components**: Comprehensive UI component library with consistent styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Data Layer
Database integration prepared with Drizzle ORM:

- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Schema**: User schema with username/password authentication
- **Migrations**: Database migrations support through Drizzle Kit
- **Environment**: Database URL configuration for deployment flexibility

# External Dependencies

## Core Dependencies
- **React & TypeScript**: Frontend framework with static typing
- **Express.js**: Backend web framework for API development
- **Wouter**: Lightweight routing library for React applications
- **TanStack Query**: Server state management and data fetching

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Database & ORM
- **Drizzle ORM**: Type-safe ORM for database operations
- **Neon Database**: PostgreSQL-compatible serverless database (@neondatabase/serverless)
- **Drizzle Zod**: Schema validation integration

## Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS post-processing with Tailwind integration
- **TypeScript**: Static type checking across the entire stack

## Form Handling & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

The architecture is designed for scalability and maintainability, with clear separation of concerns between frontend and backend, modular component structure, and type safety throughout the stack.