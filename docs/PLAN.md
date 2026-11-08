# Urosphere plan

A small, beautiful 3D world for two people who live far apart. Each of us opens a link, walks around as our own character, and we see and interact with each other in real time. It also works solo: the world is fun to wander and change on your own, and the changes are still there when the other person logs in.

We build it slowly, one small step at a time, and review the code at every step.

---

## 1. Principles

### Performance first, looks on top

Every step must first **work perfectly and run fast**. Only then do we make it prettier. Looks are layered on a fast base, never the other way round.

For every step, before calling it done:

1. **It works.** Walk in all 8 directions, sprint, orbit the camera while moving, stop and check idle. Plus whatever the step added.
2. **It's measured.** Check the numbers against the budgets below with the stats overlay and `renderer.info`. Write the numbers in the commit or in the step's notes.
3. **No per-frame waste.** No allocations (`new`, `clone()`, array/object literals) in the render loop or network hot path. No functions defined inside the loop.
4. **It cleans up.** Every new class that adds listeners, GPU resources or sockets has a `dispose()`, and it is called.
5. **It's small and readable.** One concern per commit, code you'd be happy to read in six months.

If a new visual feature breaks a budget, it waits until we find a cheaper way to do it.

### Performance budgets (first draft, we'll tune these)

| What | Budget |
| --- | --- |
| Frame rate | Solid 60 fps on the weaker of our two laptops |
| Frame time | Under 8 ms CPU + GPU, so there's headroom |
| Draw calls | Under 100 |
| Triangles on screen | Under 300k |
| Allocations in the loop | Zero |
| First load (all assets) | Under 5 MB, playable in under 3 s on good wifi |
| Memory | No growth over a 10 minute session |
| Network per player | Under 1 KB/s while moving, close to 0 while standing still |
| Seeing the other person move | Their real movement + about 100 ms |

### Keep it simple

- Exactly **two players**, and they trust each other. No anti-cheat, no matchmaking, no lobbies.
- TypeScript everywhere (browser and server), so the network message types are shared.
- No new dependency without a reason we can write down in one sentence.

---

## 2. Open questions for you

These change real decisions below, so answer them whenever you can:

1. **Devices.** What computers do you and she use? (The weaker one sets the performance target.) Will she ever play on a phone or tablet?
2. **Distance.** Where are the two of you, roughly? This picks where the server lives.
3. ~~The place~~ Decided: a golden-hour island. See `docs/ART_DIRECTION.md`.
4. ~~Voice~~ Decided: built in, early in Phase 3, so it really feels like being together.
5. **What you do together.** Collected in section 8 (ideas). Pick the 2 or 3 that matter most before Phase 4.
6. **Trackpad, mouse or controller?** And does she play games much? Used to tune the camera.

---

## 3. Decisions

Each row is something we must decide. "Leaning" is my recommendation; nothing is final until we mark it decided.

| # | Topic | Options | Leaning | Status |
| --- | --- | --- | --- | --- |
| D1 | World shape | Small open world (flat) / tiny planet | A flat island about 250 m across, surrounded by sea. New places later are new islands or realms | Decided |
| D2 | Art style | Chunky cute / soft toon / painterly / watercolor filter / anime cel | Anime cel with semi-realistic characters: 2-tone cel shading with tinted shadows, ink outlines on characters and hero props, rim light, flat colour, no tone mapping (Haven + Genshin + Sable) | Decided |
| D3 | 3D assets | Claude + Blender MCP / AI generators / hand-made / commissioned | Our own models, no free packs. World and props made with Claude + Blender MCP. Characters: try Claude + Blender MCP first, commission an artist if it can't reach the quality. Placeholder character until then | Decided |
| D4 | Asset format | glTF + Meshopt/Draco + KTX2 textures | glTF compressed with `gltf-transform`, KTX2 textures once we have more than a few | Open |
| D5 | Renderer | `WebGLRenderer` / `WebGPURenderer` | Stay on WebGL2 until we hit a limit. Revisit WebGPU later | Open |
| D6 | React Three Fiber | Move to R3F / stay imperative | Ported before the world grows. Components compose the scene, plain classes run per-frame logic from `useFrame`, nothing per-frame goes through React state. Costs +97 kB gzip because R3F bundles all of three.js | Decided |
| D7 | Physics / collision | Hand-rolled / Rapier (WASM) | Hand-rolled ground height + simple colliders first. Rapier only if we need real physics | Open |
| D8 | Network model | Server relay / peer-to-peer WebRTC / lockstep | Server relay over WebSocket (see section 5) | Open |
| D9 | Server host | Cloudflare Durable Objects / Fly.io / a VPS | Cloudflare Durable Objects: one object = our room, holds world state, sleeps when no one's on | Open |
| D10 | Wire format | JSON / binary | JSON first so it's easy to debug, binary once messages are stable (we'll measure the difference) | Open |
| D11 | Web hosting | Cloudflare Pages / Vercel / Netlify | Cloudflare Pages, same place as the server | Open |
| D12 | Access | Secret link / password / login | Secret room link + a shared passphrase. Only two people | Open |
| D13 | Desktop app | Tauri / Electron | Tauri (small download, uses the system webview). Electron if rendering differs too much between Mac and Windows | Open |
| D14 | Project layout | Single app / pnpm workspace (`web`, `server`, `shared`) | Workspace, but only when the server starts (Phase 3) | Open |
| D15 | Camera | Free orbit (AAA) / assisted follow / fixed angle | Assisted follow: 5 m behind, eases round behind you as you walk, drag to orbit, scroll to zoom, 60° field of view | Decided |
| D16 | Light and colour | Golden hour / bright day / pastel dawn | Warm golden afternoon: low sun, gradient sky, fog, one crisp following shadow, no post-processing at first | Decided |
| D17 | Voice chat | WebRTC peer-to-peer / through our server / external app | WebRTC peer-to-peer audio (Opus), signalling over our room's WebSocket, STUN + TURN fallback. Optional proximity volume (louder when you're close) | Open (detail in Phase 3) |

---

## 4. Roadmap

Phases are in order. Each phase is a list of small steps, and each step is one or a few small commits.

### Phase 0: Foundations (mostly done)

- [x] Character controller in vanilla three.js, split into classes
- [x] TypeScript
- [x] React with imperative three.js
- [x] Opposite keys no longer cancel, window resize handled
- [x] Commit the "animation clips by name" change in `Character.ts`
- [x] **Performance baseline:** dev-only overlay (`PerfStats`) with fps, worst frame, CPU ms, draw calls, triangles, GPU objects and heap
- [x] Import addons from their own files instead of `Addons.js`. The build stops emitting unused Draco/Basis decoders (output 2.7 MB → 0.86 MB). The download is unchanged at 232 kB gzip (three.js + React), since tree-shaking already dropped the unused code
- [x] Remove per-frame allocations in `Character.update` (scratch vectors, shared `UP`)
- [x] Pixel ratio and antialiasing: retina renders at 1.5× without AA, normal screens at 1× with MSAA (see the measurements log)
- [x] Take `dist/` out of git
- [x] Decide D6 and port to React Three Fiber (no drei yet)

### Phase 1: A beautiful place, solo

Built to `docs/ART_DIRECTION.md`. Each step measured.

- [ ] Ground plane + sun and hemisphere light, first cel (toon) material with a gradient ramp
- [ ] Gradient sky dome + distance fog, camera far plane trimmed to match
- [ ] Shadows: one crisp directional shadow that follows the player
- [ ] Assisted follow camera: distance, pitch, zoom, ease behind while walking, drag to orbit, 60° field of view
- [ ] Ink outlines (inverted hull) + rim light on the placeholder character
- [ ] Shared toon shader with tinted shadows, replacing `MeshToonMaterial`
- [ ] Install Blender + Blender MCP, test one tree and one rock against the model rules
- [ ] Asset pipeline: a script that compresses every model before it goes into `public/`
- [ ] The island: terrain shape, sea around it, keep the player on land, camera never below ground
- [ ] Landmarks: big tree on a hill, pond and stream, beach and pier, cottage, cliff lookout
- [ ] Instanced grass and flowers with wind sway
- [ ] Simple collision with props, camera pulls in front of big objects
- [ ] Loading screen while assets download
- [ ] The two characters: try Claude + Blender MCP first, commission if needed (in parallel, whenever ready)

### Phase 2: Things to do, solo

- [ ] Interaction system: walk close to something, a prompt appears, press `E`
- [ ] Sit on a bench (the model already has `sit`)
- [ ] Pick up and put down small objects (`pick-up`)
- [ ] Emotes on number keys (`emote-yes`, `emote-no`, wave)
- [ ] Clean animation state machine for all of the above

### Phase 3: Two players

- [ ] pnpm workspace: `web`, `server`, `shared` (message types live in `shared`)
- [ ] Local server that runs one room
- [ ] Join a room, see the other character appear and leave
- [ ] **Voice chat** (D17): microphone permission, mute button, peer-to-peer audio, works through strict networks via TURN
- [ ] Send own position and facing, show the other player smoothly (interpolation)
- [ ] Optional proximity voice: her voice gets louder as you get closer
- [ ] Sync animations and emotes
- [ ] Measure: bandwidth per player, delay, behaviour with bad wifi (Chrome network throttling)
- [ ] Reconnect cleanly when the connection drops
- [ ] Switch to binary messages if JSON shows up in the numbers

### Phase 4: Together

- [ ] Shared objects: if one of us picks something up, the other sees it in our hands
- [ ] Persistent world: things we plant or move are still there tomorrow
- [ ] The 2–3 favourite ideas from section 8, one at a time

### Phase 5: Online

- [ ] Deploy the web app and the server
- [ ] Secret room link + passphrase
- [ ] Test from both our real locations and devices, check the budgets again

### Phase 6: Desktop app

- [ ] Wrap the web build in Tauri (or Electron, see D13)
- [ ] Check performance inside the desktop webview on both machines
- [ ] Installers for both our computers

### Later, maybe

- Phones and tablets (touch controls)
- Controller support
- WebGPU renderer
- More ideas in section 8

---

## 5. Multiplayer design (draft)

### Why not lockstep or rollback

Lockstep and predict-rollback (what Rune does) make sense when players compete over the same physics and the game must be identical on every screen. That needs fully deterministic simulation in every browser and adds input delay or rollback complexity.

We don't need that. Two people who trust each other, no contest over who got somewhere first. So we use the simplest model that feels good.

### The model

- **Each client owns its own character.** Your movement runs locally with zero delay, exactly like solo. You tell the server where you are.
- **The other character is drawn slightly in the past.** We keep a short buffer of their recent states and draw them about 100 ms behind, smoothly blending between the two states around that moment (snapshot interpolation). This hides network jitter without guessing ahead.
- **The server is a small room.** It forwards movement between the two of us, and it is the one source of truth for **shared world state** (objects, planted things, notes). It saves that state so it survives when we both log off.
- **Shared objects have one owner at a time.** To pick something up you ask the server. If two requests arrive together, the first one wins and the other gets "no".

### Messages (first sketch)

| Direction | Message | Contents | How often |
| --- | --- | --- | --- |
| client → server | `join` | room id, passphrase, name | once |
| server → client | `welcome` | your player id, current world state, the other player if present | once |
| server → client | `playerJoined` / `playerLeft` | player id | on change |
| both ways | `move` | position (x, y, z), facing (yaw), animation, timestamp | about 15–20 per second while moving, nothing when still |
| both ways | `emote` | which emote | on action |
| client → server | `grab` / `drop` | object id, position | on action |
| server → client | `worldChange` | what changed | on change |

Rough size: a binary `move` is about 20 bytes. At 20 per second that's 400 bytes per second, well under the budget. We stop sending when standing still and send a small heartbeat every few seconds.

### Details to get right

- **Timestamps:** each `move` carries the sender's time so the receiver can order and space them correctly even if they arrive bunched up.
- **Send rate vs frame rate:** networking runs on its own fixed tick (e.g. every 50 ms), not every frame.
- **Packet loss:** WebSocket is reliable and ordered, so a lost packet delays the next ones a little. That's fine at our scale. If it ever feels bad we can look at WebRTC data channels or WebTransport, which can skip late packets.
- **Server location:** with long distance, the server should sit roughly between the two of us. Durable Objects are created near the first person to connect, which we may need to control.

---

## 6. Measurements log

| Date | Step | fps | Worst frame | CPU avg / worst | Calls | Tris | Heap | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-11-08 | Baseline (character + grid) | 60 | 18 ms | 0.2 / 0.8 ms | 8 | 72 | 56 MB | Dev build, Mac, sprinting |
| 2026-11-08 | React Three Fiber port | 60 | 18 ms | 0.25 / 0.5 ms | 7 | 72 | 28 MB | Sprinting. GPU 1.0–1.2 ms at 985×1440 (1.5×). Bundle 232 → 329 kB gzip |

**Pixel ratio vs antialiasing** (2026-11-08, M1, 1440×900 window, GPU time per frame with a lit ground plane, median of 300 frames, timed to GPU finish so absolute values are a bit high):

| Pixel ratio | No AA | MSAA |
| --- | --- | --- |
| 1× | 1.0 ms | 1.6 ms |
| 1.5× | 1.5 ms | 3.7 ms |
| 2× | 2.5 ms | 5.6 ms |

Chosen: 1.5× without AA on retina, 1× with MSAA on normal screens. Both cost about 1.5 ms. Raise toward 2× later only if the full world leaves room.

---

## 7. Definition of done for any step

- `pnpm exec tsc` passes
- Played in the browser: movement check from section 1 plus the new feature
- Budgets checked, numbers noted
- No debug logs, no dead code, no unused fields
- Small commit with a short lowercase message

---

## 8. Ideas for together (backlog)

Collected from our conversations. Not scheduled yet; pick favourites before Phase 4.

**Being close**
- Sit together on a bench, on the pier at sunset, or by the campfire
- Walk holding hands
- Hug, wave and other emotes (the placeholder model already has `emote-yes`, `emote-no`, `wave`)
- Lie in a hammock or on the grass and look at the sky

**Making the place yours**
- Plant flowers that are still there tomorrow
- A shared cottage to decorate together (like Sky's home space)
- Leave letters or notes for the other person to find (like Messenger)
- Photo mode to take pictures together

**Long-distance touches**
- Show each person's local time somewhere in the world
- Day and night cycle, where you both go to sleep to skip to morning instead of waiting

**Exploring**
- New islands and realms as the world grows
- Glide together off the cliff (like Haven)
- Fireflies in the evening, stars at night
- Small games to play together
