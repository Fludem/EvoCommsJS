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
- PostgreSQL database (can use Supabase PostgreSQL instance)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and set your database URL:

```
DATABASE_URL=postgres://username:password@host:port/database
```

## Database

This application uses Prisma ORM to interact with a PostgreSQL database:

```bash
# Generate Prisma client
npx prisma generate

# Pull changes from the database
npx prisma db pull
```

### Schema: `evocomms`

#### Tables:

1. **clockings** - Stores clock-in/out events
   - `id`: Primary key
   - `employee_id`: References employees table
   - `terminal_id`: References terminals table
   - `time`: Timestamp of the clocking event
   - `sent_to_api`: Whether this has been sent to external API
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

2. **terminals** - Stores connected clocking devices
   - `id`: Primary key
   - `serial_number`: Unique terminal identifier
   - `firmware`: Terminal firmware version
   - `terminal_type`: Type of terminal (TIMYAI, VF200, ANVIZ, CS100, ZKTECO)
   - `customer_id`: References customers table
   - `last_seen`: When terminal was last connected
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

3. **employees** - Stores employee/user data
   - `id`: Primary key
   - `name`: Employee name
   - `source_terminal_id`: Terminal that created this employee
   - `terminal_enroll_id`: ID of employee on terminal
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

4. **customers** - Stores customer information
   - `id`: Primary key
   - `company_name`: Name of company
   - `domain`: Company domain
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

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
├── prisma/                     # Prisma ORM files
│   └── schema.prisma           # Database schema definition
├── src/                        # Source files
│   ├── comms/                  # Communication modules
│   │   └── TimyAI/             # TimyAI device implementation
│   ├── repositories/           # Data access layer with Prisma
│   │   ├── terminal.repository.ts
│   │   ├── employee.repository.ts
│   │   ├── clocking.repository.ts
│   │   └── customer.repository.ts
│   ├── types/                  # Global type definitions
│   ├── utils/                  # Utility functions
│   │   ├── prisma.ts           # Prisma client initialization
│   │   └── logger.ts           # Logging utility
│   ├── index.ts                # Application entry point
│   └── server.ts               # Server setup and configuration
├── .env                        # Environment configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

Code should maintain clean architecture approach with clear separation of concerns, e.g:

- **Core**: Contains business logic interfaces and domain models
- **Application**: Contains use cases and business logic implementations
- **Infrastructure**: Contains external dependencies like databases, web services
- **Types**: Contains shared type definitions
- **Utils**: Contains shared utilities like logging
- **Repositories**: Data access layer that abstracts database operations

