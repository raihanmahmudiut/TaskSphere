# Project Roadmap: TaskSphere Workflow Enhancements

## Overview

This document outlines the implementation plan for "Pro-tier" workflow features, focusing on Critical Path Analysis, Real-time Presence, and Interactive Graph UX.

---

## 1. Collaborative Presence (Socket.IO)

**Goal:** Visualize other active users on the graph to prevent "edit collisions."

### Tech Specs

- **Backend:** Update `websocket` gateway to handle `MOUSE_MOVE` and `NODE_SELECT` events.
- **Frontend:** Create a `PresenceCanvas` overlay using React Flow's `Pane` and Framer Motion.
- **Shared Types:** Add `CursorPosition` and `UserPresence` to `packages/shared`.

### Guidelines for Agent

- Implement a throttle (50-100ms) on mouse movement emits to prevent socket flooding.
- Store active user presence in a Redis cache or a simple in-memory `Map` on the NestJS server.
- Render user avatars next to cursors using `shadcn/ui` Avatar components.

---

## 2. Critical Path Analysis (CPA)

**Goal:** Highlight the sequence of tasks that determine the project duration.

### Tech Specs

- **Algorithm:** Implement a "Forward Pass / Backward Pass" algorithm using the existing `dagre` layout data.
- **Logic:**
  - `Early Start + Duration = Early Finish`
  - `Late Finish - Duration = Late Start`
  - Tasks where `Total Float == 0` are on the Critical Path.
- **UI:** Dynamically update React Flow `edges` and `nodes` with a `critical-path` class (Tailwind: `stroke-destructive` / `shadow-red-500`).

### Guidelines for Agent

- Add a `duration` field to the `tasks` schema in `packages/db` (default to 1 unit if null).
- Create a reusable hook `useCriticalPath` that accepts `nodes` and `edges` and returns an array of `criticalNodeIds`.

---

## 3. Interactive Dependency Linking

**Goal:** Allow users to draw dependencies directly on the canvas.

### Tech Specs

- **Frontend:** Enable `onConnect` in React Flow.
- **Validation:** Call the existing NestJS `check-cycle` endpoint _optimistically_ before finalizing the edge.
- **Backend:** Create a `POST /tasks/dependencies` endpoint that updates the Drizzle join table.

### Guidelines for Agent

- Use `SmoothStepEdge` for better visual routing around nodes.
- If a cycle is detected, use a `sonner` toast to notify the user and revert the edge creation.

---

## 4. Smart Focus & Impact Analysis

**Goal:** Help users navigate complex graphs by showing upstream/downstream effects.

### Tech Specs

- **Feature:** "Neighborhood Focus."
- **Implementation:**
  - On node click, use a BFS (Breadth-First Search) to find all ancestors and descendants.
  - Set `opacity-20` on all nodes/edges not in that set.
- **Impact Tooltip:** Calculate the sum of `duration` for all descendant nodes to show "Total Work Impact."

### Guidelines for Agent

- Implement this as a "Focus Mode" toggle in the Workflow UI toolbar.
- Use `zustand` to manage the `focusedNodeId` and the resulting `impactSet`.

---

## 5. Development Standards

### Implementation Order

1. **Schema Update:** Add `duration` and `metadata` to Drizzle schema.
2. **Websocket:** Implement Cursor/Presence sync.
3. **Graph Logic:** Implement CPA and Neighborhood Focus hooks.
4. **UX:** Add Interactive Edge dragging and styling.

### Definition of Done (DoD)

- [ ] No circular dependencies allowed via UI or API.
- [ ] Multiple users can see each other's cursors on the graph canvas.
- [ ] Critical path is visually distinct from standard dependencies.
- [ ] All new types are exported from `packages/shared`.
- [ ] Playwright E2E test covers "Create Dependency via Drag & Drop."
