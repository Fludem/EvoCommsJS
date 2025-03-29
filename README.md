# EvoCommsJS

A Node.js service for handling multiple clocking machine communications. This service supports various protocols for receiving clocking times, managing employee data, and handling biometric data.

## Features

- Support for multiple communication protocols
- Employee data management
- Biometric data handling
- Clocking time processing
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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
src/
├── protocols/     # Protocol implementations
├── services/      # Business logic services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── index.ts       # Application entry point
└── server.ts      # Main server implementation
```

## License

ISC
