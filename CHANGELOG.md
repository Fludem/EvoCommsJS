# EvoComms JS Changelog

0.1.0 will be considered ready for testing and in alpha stage. Untl then the project is likely in an unstable or unusable state.

## 0.0.4 (Pre-Alpha)

### Backend
- Added RESTful API endpoints for Clockings, Terminals, and Customers
- Implemented API health check endpoint

## 0.0.3 (Pre-Alpha)

### Frontend
- Added React TypeScript Vite frontend with ShadCN UI
- Implemented dashboard page with stats and metrics
- Created shared Layout component for consistent UI across pages
- Set up React Router for navigation
- Implemented dark mode theme support

### Backend
- Installed ExpressJS for API endpoints to be used by React frontend
- Set up API integration between frontend and existing backend services
- Added proper routing and endpoint structure

## 0.0.2 (Pre-Alpha)

### EvoTime API Integration
- Added integration with EvoTime API for terminal resolution
- Implemented customer lookup and synchronization
- Added automatic customer creation from EvoTime data
- Enhanced terminal registration with customer validation

### Database Schema Updates
- Modified terminals table to require customer association
- Updated schema to enforce referential integrity
- Added evotime_tenant_id to customers table
- Improved type safety in database operations

### Terminal Registration Improvements
- Enhanced terminal registration flow with customer validation
- Added graceful connection handling for unregistered terminals
- Improved error handling and logging during registration
- Updated terminal repository to enforce customer relationships

## 0.0.1 (Pre-Alpha)

### Architecture & Dependency Injection
- Implemented dependency injection using tsyringe
- Created DI container with proper service registration
- Refactored components to use @injectable() decorators
- Added proper token-based injection for interfaces
- Fixed WebSocketServerAdapter port injection
- Created HandlerService to replace factory pattern
- Improved testability and reduced coupling

### Database & ORM
- Implemented Prisma ORM with PostgreSQL
- Built and designed PostgreSQL database schema using Supabase
- Added database models:
  - Clockings (time entries from terminals)
  - Employees (user data from terminals)
  - Terminals (device information)
  - Customers (client accounts)
- Created repository layer with full CRUD operations for all models
- Implemented proper handling for BigInt ID fields

### Project Structure & Development
- Set up TypeScript with proper configuration
- Created comprehensive documentation in README.md
- Added dependency management with package.json
- Set up ESLint and Prettier for code quality
- Implemented environment variable management with dotenv
- Added logging with Pino and BetterStack integration

### TimyAI Protocol Implementation
- Added TimyAI documentation translated and improved from original Chinese version
- Implemented WebSocket support for incoming TimyAI connections
- Created event-based architecture for terminal communications
- Added handlers for core terminal commands:
  - Terminal registration
  - Clocking data transmission (SendLog)
  - User data synchronization
  - Device information exchange
- Implemented terminal connection lifecycle management

### Architecture
- Designed clean architecture with separation of concerns
- Created repository pattern for data access
- Implemented proper error handling throughout the codebase
- Added type safety with TypeScript interfaces
