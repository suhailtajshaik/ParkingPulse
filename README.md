# ParkingPulse

ParkingPulse is a web application designed to manage and monitor parking events in a multi-level parking facility. It provides real-time updates on gate statuses and overall occupancy.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)

## Installation

To get started with ParkingPulse, clone the repository and install the dependencies:

```bash
git clone https://github.com/suhailtajshaik/ParkingPulse.git
cd ParkingPulse
npm install
```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will start the server and the client in development mode.

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the project for production.
- `start`: Runs the production build.
- `check`: Runs TypeScript type checking.
- `db:push`: Pushes the database schema using Drizzle Kit.

## Dependencies

ParkingPulse uses a variety of dependencies for both the client and server. Key dependencies include:

- `express`: For server-side routing and middleware.
- `react`: For building the user interface.
- `socket.io`: For real-time communication.
- `drizzle-orm`: For database management.
- `tailwindcss`: For styling the application.

For a full list of dependencies, see the `package.json` file.

## Development

ParkingPulse is built with modern web technologies including React, Express, and TypeScript. The project is structured with a client and server directory, each containing relevant code for the frontend and backend.

### Client

The client is built with React and uses Tailwind CSS for styling. Components are located in the `client/src/components` directory.

### Server

The server is built with Express and TypeScript. It handles API requests and manages parking events and gate statuses.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
