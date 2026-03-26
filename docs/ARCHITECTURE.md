# CatSpin Arena — Architecture

## Overview

CatSpin Arena is a multiplayer slot-based game built as a TypeScript monorepo.
The project follows a layered architecture:

- **core** — deterministic game rules and state transitions
- **protocol** — DTOs, schemas, and client/server event contracts
- **server** — authoritative room management, HTTP, and WebSocket transport
- **web** — React client, local UI state, and realtime rendering
- **shared** — generic helpers reused across packages

The main architectural principle is:

> **The server is authoritative, and the core is deterministic.**

The web client does not decide game outcomes.
It only sends player intent and renders the latest server state.

---

## Monorepo Structure

```text
packages/
  core/
  protocol/
  shared/

apps/
  server/
  web/
```

### `packages/core`

Contains pure game logic with no transport or UI concerns.

Responsibilities:

- game state definitions
- round lifecycle
- command application
- deterministic ticking
- slot spin generation
- payout calculation
- public-state derivation

### `packages/protocol`

Contains the contract between client and server.

Responsibilities:

- DTO definitions
- zod schemas
- socket event types
- request/response payload formats

### `packages/shared`

Contains reusable helpers shared by multiple apps/packages.

Responsibilities:

- ids
- utility helpers
- cross-package small abstractions

### `apps/server`

Authoritative backend.

Responsibilities:

- room creation
- room lookup
- websocket lifecycle
- room subscriptions
- periodic game ticking
- DTO mapping
- validation boundary between transport and core

### `apps/web`

Realtime React client.

Responsibilities:

- socket connection
- local UI flow
- screen routing
- room join/create UX
- rendering lobby/game state
- local spin animation synchronized with round status

---

## High-Level Data Flow

```text
React UI
  -> Client Store
    -> Realtime Client
      -> WebSocket
        -> Server Handlers
          -> Room
            -> applyCommand / tickGame (core)
              -> PublicGameState
                -> DTO mapper
                  -> WebSocket broadcast
                    -> Client Store
                      -> React UI rerender
```

### Flow summary

1. The player performs an action in the UI.
2. The web client sends a client event through WebSocket.
3. The server validates the event and forwards the intent into a room.
4. The room applies the command to the authoritative game state.
5. The game loop periodically calls `tickGame(...)`.
6. Updated public state is mapped into DTOs.
7. All room subscribers receive a fresh `room_state`.
8. The React UI rerenders from the new room snapshot.

---

## Core Layer

## Main rule

The core should remain:

- deterministic
- serializable
- transport-agnostic
- UI-agnostic

That means no:

- DOM
- React
- WebSocket
- Fastify
- timers owned by the browser/server runtime

It only accepts input state + commands + timestamps and returns next state.

### Important core APIs

#### `createGame()`

Creates the initial game state.

#### `applyCommand(state, command)`

Applies player intent:

- add player
- remove player
- set ready
- set bet
- start game

This is used for immediate, user-driven transitions.

#### `tickGame(state, now)`

Applies time-driven transitions:

- betting -> spinning
- spinning -> resolved
- resolved -> next betting round
- finish conditions

This is used by the server game loop.

#### `getPublicState(state)`

Builds the safe state that may be exposed outside the core.

### Round lifecycle

```text
idle -> betting -> spinning -> resolved -> betting -> ...
```

- `idle` — before active game loop begins
- `betting` — players place bets
- `spinning` — server waits spin duration before resolving result
- `resolved` — result is available and balances are updated

### Spin trigger

A round enters `spinning` when:

- all active connected players placed valid bets, or
- betting timeout expires

### Determinism

Spin results are generated from deterministic RNG state.
That gives:

- reproducible behavior
- easier testing
- predictable debugging
- clear server authority

---

## Server Layer

The server owns the live runtime.

## Main rule

The server is the single source of truth.

Clients may request actions, but they do not decide:

- whether a command is valid
- who may join
- when a round advances
- what symbols were spun
- who won

### Room

A `Room` is the main runtime unit.

Responsibilities:

- hold authoritative `GameState`
- manage player sessions
- apply commands
- tick game state
- broadcast room snapshots to subscribers

Important methods:

- `joinPlayer(...)`
- `removePlayer(...)`
- `disconnectPlayer(...)`
- `setReady(...)`
- `setBet(...)`
- `startGame(...)`
- `tick(now)`

### RoomManager

A `RoomManager` owns all active rooms.

Responsibilities:

- create room
- get room
- remove room
- tick all rooms
- cleanup empty rooms

### GameLoop

`GameLoop` periodically calls:

```ts
roomManager.tickAll(now);
```

This is what makes time-based state transitions actually happen.

Without the game loop:

- bets may update
- room state may broadcast
- but rounds never move forward automatically

### WebSocket handlers

Transport layer handlers are intentionally thin.

Responsibilities:

- parse incoming messages
- validate event shape
- resolve room
- delegate into room methods
- send DTO-based server events

They should not contain business logic already owned by the core or room layer.

### Join policy

Join behavior is intentionally split:

- **Lobby**: new players may join
- **Running game**: only reconnecting existing players may rejoin
- **Finished game**: no new join unless explicitly supported later

This preserves game integrity.

### Disconnect vs leave

These are different events.

#### Disconnect

Temporary transport failure.
The player remains part of the game but is marked offline.

#### Leave

Explicit user intent to leave the room.
This is treated as permanent exit from that room flow.

---

## Session Layer

Player connectivity is tracked separately from the pure game state.

This is important because:

- gameplay state and transport state are different concerns
- a player can still conceptually exist in the game while temporarily offline

### `PlayerSession`

Represents connection/session metadata such as:

- session id
- room id
- player id
- connected flag

### Why `isConnected` is derived from sessions

The final public room state merges:

- gameplay info from the core state
- connectivity info from active sessions

This prevents transport-specific state from polluting pure core logic while still letting the UI show:

- online/offline indicators
- reconnect behavior
- active-player filtering for auto-spin logic

---

## Protocol Layer

The protocol package defines the public contract.

### Client events

Examples:

- `join_room`
- `leave_room`
- `set_ready`
- `set_bet`
- `start_game`

### Server events

Examples:

- `room_state`
- `joined_room`
- `left_room`
- `error`

### DTO separation

Internal core structures are not sent directly.
Instead, the server maps them into DTOs.

Benefits:

- decouples internal implementation from transport
- allows safe reshaping of public data
- makes validation easier
- protects invariants and hidden internal fields

---

## Web Client Layer

The web client is a renderer plus interaction layer.

## Main rule

The client is reactive, not authoritative.

It should:

- display the current room state
- send player intent
- animate transitions based on server state

It should not:

- generate real spin outcomes
- compute authoritative payouts
- decide round transitions

### Client store

The store owns:

- connection status
- current room
- player id
- player name
- error state

The store bridges:

- UI
- HTTP room creation
- realtime WebSocket client

### Realtime client

The realtime client wraps socket transport and is responsible for:

- opening the socket
- sending typed events
- receiving server events
- persisting identifiers

### Identity persistence

The client persists:

- `playerId` in `localStorage`
- `sessionId` in `sessionStorage`
- player name in local storage utilities

This enables:

- reconnect after refresh
- stable player identity across browser reloads
- improved room-link flow

### Screen flow

Current UI flow:

```text
Name -> Room Setup -> Lobby -> Game
```

### Game screen rendering

The game screen reads:

- room state
- current round phase
- resolved spin results
- player balances and bets

Local slot animation is allowed, but only as a visual effect.
The source of truth remains:

- `round.status`
- `round.result`

---

## Important Architectural Decisions

### 1. Deterministic core

Chosen to simplify:

- testing
- debugging
- reproducibility
- future bot/simulation support

### 2. Authoritative server

Chosen to prevent:

- client-side cheating
- inconsistent room state
- divergent round progression

### 3. DTO mapping layer

Chosen to keep:

- protocol stable
- internals decoupled
- payloads explicit

### 4. Session connectivity outside core

Chosen to avoid mixing:

- transport concerns
- gameplay concerns

### 5. Monorepo with workspaces

Chosen to allow:

- shared types
- fast refactors
- consistent contracts across packages

---

## Current Weak Spots

- no database or long-term persistence
- no auth layer
- reconnect grace timeout is not finalized
- leave vs resume UX can still improve
- animations and polished UI are still in progress
- no automated integration test coverage yet

---

## Future Evolution

### Near-term

- slot reel visuals
- winning-line highlighting
- better reconnect UX
- improved lobby layout
- graceful disconnect timeout

### Mid-term

- automated tests for core and server flow
- richer round presentation
- sound and feedback systems
- mobile-first layout improvements

### Possible long-term

- spectators
- rematch flow
- persistent profiles
- match history
- analytics / telemetry
- AI/bot players for testing

---

## Summary

CatSpin Arena already has the right backbone:

- deterministic core
- authoritative realtime server
- clean protocol boundary
- reactive web client
- room/session separation

That means the hard structural part is already in place.

The main work now is no longer “make architecture exist”.
The main work is:

- improve user experience
- refine reconnect behavior
- polish visuals and feedback
- add test coverage
