# Claims Playwright API Test Suite (Mock Server)

This repository contains a Playwright-based API test suite for the Claims API.
It uses a deterministic **mock server** (Express) implementing the behaviour described in the provided OpenAPI and Test Case Suite.

## Features
- One test file per test case (TC1-TC8 + negative tests)
- Reusable `ApiClient` wrapper
- JSON schema validation using AJV
- Mock server implementing endpoints and error behaviours
- GitHub Actions CI workflow (starts mock server and runs tests)

## Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start mock server (in one terminal):
   ```bash
   npm run start:mock
   ```

3. Run tests:
   ```bash
   npm test
   ```

Or run tests and start the mock server in CI (workflow included).

## Token & credentials
Mock server accepts:
- username: `user`
- password: `pass`
and returns a fixed token `valid-token`.