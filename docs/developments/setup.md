````md
# VyuKarya Development Setup

This guide explains how to set up the VyuKarya development environment, run the frontend and backend applications, configure environment variables, and verify the local development setup.

---

## 1. Prerequisites

Make sure the following tools are installed:

- Node.js 20+
- npm
- Git

Verify the installations:

```bash
node --version
npm --version
git --version
````

---

## 2. Clone the Repository

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd vyukarya
```

The project follows a separate frontend/backend structure:

```text
vyukarya/
├── client/                 # React + TypeScript frontend
├── server/                 # Node.js + Express + TypeScript backend
├── docs/                   # Project documentation
└── README.md
```

---

## 3. Client Setup

The client is built using React, TypeScript, and Vite.

Navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

By default:

```text
http://localhost:5173
```

The client is responsible for the VyuKarya user interface and communicates with the backend through HTTP APIs.

---

## 4. Server Setup

The server is built using Node.js, Express, and TypeScript.

Open a separate terminal and navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```text
server/.env
```

Add:

```env
PORT=5000
```

Start the development server:

```bash
npm run dev
```

The API will normally be available at:

```text
http://localhost:5000
```

---

## 5. Environment Variables

Environment variables are used to keep application configuration outside the source code.

The server uses:

```text
server/.env
```

for local configuration.

Example:

```env
PORT=5000
```

A template is provided through:

```text
server/.env.example
```

Example:

```env
PORT=5000
```

### Important

The `.env` file must not be committed to Git.

When a new environment variable is introduced:

1. Add the actual value to your local `.env`.
2. Add the variable name and a safe example value to `.env.example`.
3. Never commit secrets, credentials, tokens, or private configuration.

Future environment variables may include:

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

These will be introduced when the corresponding features are implemented.

---

## 6. Running the Full Application

The frontend and backend currently run as separate development processes.

### Terminal 1 — Frontend

```bash
cd client
npm run dev
```

### Terminal 2 — Backend

```bash
cd server
npm run dev
```

The development architecture is:

```text
Browser
   │
   ▼
React + Vite
   │
   │ HTTP / REST API
   ▼
Node.js + Express
   │
   ▼
Application Services
   │
   ▼
MongoDB
```

MongoDB integration will be added in a later milestone.

---

## 7. Backend Health Check

The server currently exposes a health-check endpoint:

```http
GET /api/health
```

Open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "message": "VyuKarya API is running"
}
```

The health-check endpoint provides a simple way to verify that the Express application is running correctly.

---

## 8. Server Scripts

Run these commands from the `server` directory.

### Development

```bash
npm run dev
```

Starts the TypeScript server using `tsx` and watches for source changes.

### Type Check

```bash
npm run typecheck
```

Runs TypeScript's type checker without generating JavaScript files.

### Production Build

```bash
npm run build
```

Compiles the TypeScript source into JavaScript inside:

```text
server/dist/
```

### Production Start

```bash
npm start
```

Runs the compiled application from the `dist` directory.

---

## 9. TypeScript Build Flow

The backend source code is written in TypeScript:

```text
server/
└── src/
    ├── app.ts
    └── server.ts
```

### Development

During development, `tsx` executes the TypeScript application:

```text
TypeScript
    ↓
tsx
    ↓
Node.js
```

### Production

For a production build, TypeScript is compiled into JavaScript:

```text
src/*.ts
    ↓
TypeScript Compiler (tsc)
    ↓
dist/*.js
    ↓
Node.js
```

The generated `dist` directory should not be committed to the repository.

---

## 10. Git-Ignored Files

The server ignores:

```gitignore
node_modules/
dist/
.env
```

### node_modules/

Contains installed dependencies.

It can be recreated using:

```bash
npm install
```

### dist/

Contains generated JavaScript produced by the TypeScript build.

### .env

Contains local environment configuration and may contain sensitive values.

The following files should normally be committed:

```text
package.json
package-lock.json
tsconfig.json
.env.example
src/
```

---

## 11. Project Development Workflow

VyuKarya follows a feature-branch development workflow.

```text
GitHub Issue
     ↓
Create Branch
     ↓
Implementation
     ↓
Local Testing
     ↓
Type Checking
     ↓
Production Build
     ↓
Review Git Diff
     ↓
Commit
     ↓
Push
     ↓
Pull Request
     ↓
CI Checks
     ↓
Code Review
     ↓
Merge
```

The `main` branch represents the stable project state.

Normal development should happen on dedicated branches.

Examples:

```bash
git checkout -b feature/authentication
```

```bash
git checkout -b feature/workspace
```

```bash
git checkout -b fix/login-validation
```

```bash
git checkout -b chore/docker
```

---

## 12. Local Verification

Before creating a Pull Request, verify the relevant application.

### Client

From the `client` directory:

```bash
npm run build
```

### Server

From the `server` directory:

```bash
npm run typecheck
npm run build
```

Also verify the backend health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "message": "VyuKarya API is running"
}
```

Automated CI will later perform these checks automatically for Pull Requests.

---

## 13. Current Project Foundation

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* Express
* TypeScript
* tsx
* dotenv

### Current Backend Structure

```text
server/
├── src/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Current API

```http
GET /api/health
```

---

## 14. Planned Development Stack

Technologies will be introduced incrementally as project requirements demand them.

### Frontend

* React
* TypeScript
* Redux Toolkit
* REST API integration

### Backend

* Node.js
* Express
* TypeScript
* Authentication
* Authorization / RBAC
* Request validation

### Database

* MongoDB
* Mongoose

### Testing

* Unit testing
* Integration/API testing
* Selected E2E testing

### Infrastructure

* Docker
* GitHub Actions
* AWS

### Deployment

* Container registry
* Compute infrastructure
* HTTPS
* Domain
* Logging and monitoring

Technologies are intentionally introduced according to project requirements rather than being added to the project all at once.

---

## 15. Troubleshooting

### Port Already in Use

If port `5000` is already occupied, change the value in:

```text
server/.env
```

For example:

```env
PORT=5001
```

Restart the server afterward.

---

### Dependencies Missing

Run:

```bash
npm install
```

inside the relevant directory:

```text
client/
```

or:

```text
server/
```

---

### TypeScript Errors

Run:

```bash
npm run typecheck
```

from the `server` directory to identify TypeScript errors.

---

### Build Errors

Run:

```bash
npm run build
```

and resolve the reported compilation errors before committing.

---

## 16. Future Setup Requirements

As development progresses, this document will be updated when new infrastructure is introduced, including:

* MongoDB configuration
* Authentication environment variables
* API configuration
* Testing setup
* Docker development environment
* CI/CD requirements
* AWS deployment configuration

```
```
