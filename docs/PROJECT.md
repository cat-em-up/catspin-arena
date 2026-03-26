# 🐱 CatSpin Arena

## 🔥 What is this

**CatSpin Arena** is a real-time multiplayer PvP slot machine.

Players join a shared room, place bets, and every X seconds a spin is executed.

👉 This is not just a “casino”, it is:

- a deterministic game engine
- a real-time multiplayer system
- server-authoritative gameplay
- clean architecture (core / protocol / transport / UI)

---

## 🎮 Core Concept

1. A player opens the page
2. A room is created + a unique shareable link is generated
3. The player invites friends via the link
4. Players join the room
5. Host presses **START**
6. The game begins:
   - slot spins every N seconds
   - players place/adjust bets each round
   - wins/losses are calculated

---

## 🏆 Win Conditions

- Reach a target balance (e.g. 2x–5x start)
- Or be the last player with balance > 0

Players with balance <= 0 are eliminated.

---

## 🧠 Architecture

### 1. Core (engine)

Pure deterministic logic. No network, no UI.

Responsibilities:

- RoomState
- PlayerState
- Bet processing
- Spin generation (seed-based RNG)
- Payout calculation
- Tick loop

---

### 2. Protocol

Typed contract between client and server.

Examples:

```ts
export type ClientEvent =
  | { type: 'join_room'; name: string }
  | { type: 'place_bet'; amount: number }
  | { type: 'ready' };

export type ServerEvent = { type: 'state_update'; state: RoomState } | { type: 'spin_result'; result: SpinResult };
```

---

### 3. Server

Authoritative game host.

Responsibilities:

- manage rooms
- handle connections (WebSocket)
- forward events to core
- broadcast state updates

---

### 4. Clients

#### CLI Client (dev tool)

- fast testing
- multi-player simulation

#### Web Client (showcase)

- slot machine UI
- animations
- betting controls

---

## ⚙️ Key Features

- Deterministic RNG (seed-based)
- Real-time tick system
- PvP economy (players compete for balance)
- Shared room state
- Simple but extensible protocol

---

## 🚀 Current Status

### ✅ Done

- Monorepo setup (pnpm)
- Project structure (apps / packages)
- Initial concept defined

### 🔄 In Progress

- Core data models (RoomState, PlayerState)
- Spin + payout logic

### ⏳ Next Steps

1. Implement deterministic RNG
2. Implement tick loop
3. Add CLI simulation
4. Build WebSocket server
5. Add web UI (slot machine)

---

## 💡 Goal

Build a small but solid multiplayer system that demonstrates:

- clean architecture
- deterministic game logic
- real-time synchronization
- production-ready TypeScript structure

👉 Something that looks fun… but reads like s
