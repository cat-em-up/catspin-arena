# CatSpin Arena — Status

## Overview

CatSpin Arena is a multiplayer slot-based game with a deterministic core, real-time server, and web client.
The project is structured as a TypeScript monorepo using `pnpm` workspaces.

Architecture:

- packages/core — pure deterministic game logic
- packages/protocol — DTOs, schemas, and event contracts
- packages/shared — shared utilities and helpers
- apps/server — Fastify HTTP + WebSocket authoritative server
- apps/web — React/Vite client

---

## Current State

### Core (@catspin/core)

Implemented:

- Game state:
  - `GameState`
  - `PlayerState`
  - `RoundState`
- Game lifecycle:
  - `createGame()`
  - `applyCommand()`
  - `tickGame()`
  - `getPublicState()`
- Round phases:
  - `idle`
  - `betting`
  - `spinning`
  - `resolved`
- Slot engine:
  - deterministic RNG
  - symbol grid generation
- Payout system:
  - `PayoutCalculator`
  - winning lines + multipliers
- Auto spin trigger when all active players placed bets

Symbols:

`L1`, `L2`, `L3`, `L4`, `M1`, `M2`, `H1`, `H2`

Status: **stable**

---

### Protocol (@catspin/protocol)

Implemented:

- DTOs:
  - `PlayerDTO`
  - `GameStateDTO`
  - `RoomDTO`
- Client events:
  - `join_room`
  - `leave_room`
  - `set_ready`
  - `set_bet`
  - `start_game`
- Server events:
  - `room_state`
  - `joined_room`
  - `left_room`
  - `error`
- Runtime validation via zod

Status: **stable**

---

### Server (@catspin/server)

Implemented:

- room system via `Room` / `RoomManager`
- HTTP room creation route
- WebSocket server on `/ws`
- socket event handlers:
  - join
  - leave
  - ready
  - bet
  - start
- room subscriptions and state broadcasting
- DTO mapping via `toRoomDto()` / `toGameStateDto()`
- central tick/game loop
- reconnect support for existing players
- disconnect vs leave separation
- online/offline state derived from sessions

Status: **working (stable core loop)**

---

### Web Client (@catspin/web)

Implemented:

- Vite dev setup + proxy
- WebSocket realtime client
- client store:
  - connection status
  - room state
  - playerId (persisted)
  - playerName (persisted)
- auto-join via URL hash
- multi-screen flow:
  - Name
  - Room Setup
  - Lobby
  - Game
- PlayerItem component (no duplication)
- online/offline UI indicator
- create / join / leave flows
- reconnect using persisted playerId

In progress:

- slot machine rendering
- spin animation
- result visualization

Status: **working + actively evolving**

---

### TypeScript / Monorepo Setup

Configured:

- ESNext modules
- workspace imports
- shared typing
- strict typing (no `any`)

Status: **stable**

---

## Manual Testing

Verified:

- create room
- join room
- reconnect after refresh
- leave room
- online/offline state sync
- start game flow
- betting → spinning → resolved loop
- multiple players interaction

---

## Current Limitations

- no DB / persistence
- no auth
- no reconnect grace timeout
- no animations yet
- no polished UI
- no sound
- leave = permanent exit (no rejoin mid-game)

---

## Next Steps

### Gameplay / UX

- slot reel rendering
- spin animation synced with server
- highlight winning lines
- show multipliers and wins
- add sound effects

### Networking

- reconnect grace period (timeout before remove)
- better reconnect UX ("reconnecting...")
- optional spectator mode

### UI

- redesign lobby layout
- player cards
- animations and feedback
- mobile adaptation

### Quality

- unit tests for core
- integration tests for server flow

---

## Status Summary

- Core: **stable**
- Protocol: **stable**
- Server: **working**
- Web: **working prototype**
- Overall: **game loop + networking solid; focus now on visuals and feel**
