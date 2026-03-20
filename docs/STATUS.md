# CatSpin Arena — Status

## Overview

CatSpin Arena is a multiplayer slot-based game with a deterministic core, real-time server, and web client.  
The project is structured as a TypeScript monorepo using `pnpm` workspaces.

Architecture:

- packages/core — pure game logic (deterministic, no side effects)
- packages/protocol — DTOs, schemas, and event contracts
- packages/shared — shared utilities and types
- apps/server — Fastify + WebSocket server
- apps/web — React client (in progress)

---

## Current State

### Core (@catspin/core)

Implemented:

- Game state:
  - GameState
  - PlayerState
  - RoundState
- Game lifecycle:
  - createGame()
  - applyCommand()
  - tickGame()
  - getPublicState()
- Round phases:
  - idle
  - betting
  - spinning
  - resolved
- Slot engine:
  - deterministic RNG
  - symbol grid generation
- Payout system:
  - PayoutCalculator
  - winning lines + multipliers

Symbols (normalized):

L1, L2, L3, L4  
M1, M2  
H1, H2

---

### Protocol (@catspin/protocol)

Implemented:

- DTOs:
  - PlayerDTO
  - GameStateDTO
  - RoomDTO
- Client events:
  - join_room
  - leave_room
  - set_ready
  - set_bet
  - start_game
- Server events:
  - room_state
  - joined_room
  - left_room
  - error
- Runtime validation via zod

Important:

Core state is NOT exposed directly — all data is mapped to DTOs.

---

### Server (@catspin/server)

Implemented:

Room system, game loop, HTTP API, WebSocket handlers, broadcasting and DTO mapping.

---

### TypeScript / Monorepo Setup

Configured ESNext modules, Bundler resolution, workspace paths and fixed all major TS issues.

---

### Manual Testing (Completed)

End-to-end flow verified: create room → join → ready → bet → start → full round lifecycle.

---

## Current Limitations

- No tests
- No persistence
- No auth
- No rate limiting

---

## Next Steps

### Web Client (@catspin/web)

- WebSocket client
- State management
- Lobby UI
- Game UI

---

## Status Summary

- Core: stable
- Protocol: stable
- Server: working
- Web: in progress
