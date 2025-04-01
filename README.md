# EvoCommsJS

WIP Node.js service for handling multiple clocking machine comms. Will be specifically for Evotime and
not self install stuff.

Will have to support various protocols for receiving clocking times, managing employee data, etc etc.

## Communication Docs:
- [TimyAI Protocol](docs/timyai/readme.md)

## Features

- Support for multiple communication protocols
- Employee data management
- Biometric template syncing/sharing
- Handling Clockings

## Prerequisites

- Node.js (v20or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

## Building

To build the project:

```bash
npm run build
```

## Production

To start the production server:

```bash
npm start
```

## Project Structure

```
EvoCommsJS/
├── src/                         # Source files
│   ├── comms/                   # Communication modules
│   │       └── TimyAI/          # TimyAI device implementation
│   │           ├── application/ # Application layer (use cases)
│   │           ├── core/        # Core business logic interfaces
│   │           ├── infrastructure/ # Infrastructure implementations
│   │           ├── types/       # TimyAI-specific type definitions
│   │           └── TimyAIServer.ts # Main server class for TimyAI
│   ├── types/                   # Global type definitions
│   ├── utils/                   # Utility functions
│   │   └── logger.ts            # Logging utility with BetterStack integration
│   ├── index.ts                 # Application entry point
│   └── server.ts                # Server setup and configuration
├── .env                         # Environment configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

Code should maintain clean architecture approach with clear separation of concerns, e.g:

- **Core**: Contains business logic interfaces and domain models
- **Application**: Contains use cases and business logic implementations
- **Infrastructure**: Contains external dependencies like databases, web services
- **Types**: Contains shared type definitions
- **Utils**: Contains shared utilities like logging

