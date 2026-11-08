# Urosphere art direction

The decided look, world, camera and light. Decided 2026-11-08: the owner loved Haven and wanted anime-style 3D with ink outlines and semi-realistic characters, and asked for the rest to be decided for them. This is the source of truth for every model, material and scene change. Numbers are starting points, tuned by playing and measuring.

**One line:** a warm golden-hour island drawn like an anime film. Semi-realistic characters, flat cel colours with soft shadow edges, ink outlines, and a free camera you steer yourself, like Genshin.

**Cozy everywhere:** not just the 3D world. The cursor, loading screen, menus, buttons and sounds all share the same warm, soft, cute style. Nothing should feel like a default browser or engine element.

**Main references:** **Haven** (characters, colour, the couple), **Genshin Impact** (cel shading on semi-realistic characters, rim light, open-world camera), **Sable** (ink lines and flat colour carrying a whole world), **Guilty Gear Xrd** (how to make 3D read as 2D). Full list in `docs/REFERENCES.md`.

---

## 1. Rendering style: "anime cel, semi-real"

| Rule | What it means | Why |
| --- | --- | --- |
| **Cel shading** | Every surface is lit in 2 tones (light and shadow) with a narrow soft edge between them, from a shared gradient ramp. No smooth realistic falloff | The core anime look. Haven's softness, not hard Borderlands bands |
| **Tinted shadows** | Shadow tone is a cool lavender-blue version of the colour, never grey or black | Anime films paint shadows in colour. It's what makes it look warm instead of dirty |
| **Ink outlines** | Dark outlines on characters and important props, in a dark warm ink (a darkened version of the surface colour, not pure black). None on grass, terrain or far-away things | The "3D drawn like anime" look you asked for. Outlining everything gets noisy, which is also why Genshin and Sable are selective |
| **Rim light** | A thin bright edge on characters on the side facing the sun | Separates characters from the background, very Genshin |
| **Flat colour, little texture** | Mostly flat colour areas from small palette textures. Painted detail only on faces and a few hero props. **No normal maps** | Cel shading ignores fine surface detail anyway (Guilty Gear Xrd skipped normal maps). Small downloads, little memory |
| **No tone mapping** | Colours on screen are exactly the colours we pick | Cel art is about a controlled palette. Keeps today's `flat` setting |
| **No post-processing at first** | No bloom, no full-screen filters in Phase 1 | Full-screen passes are the biggest cost at our resolution. Added later only if measured and worth it |

How it's built (Phase 1 steps):

- Start with three.js `MeshToonMaterial` + a 3-pixel gradient ramp texture, then move to one shared custom toon shader once we need tinted shadows and rim light in the same material.
- Outlines with the **inverted hull** method: a second, slightly bigger copy of the mesh drawn back-faces only in ink colour. Costs 1 extra draw per outlined mesh, so it's fine for 2 characters and a handful of hero props. A full-screen edge-detection pass is the alternative if we ever want everything outlined; measure first.
- Models need smooth (averaged) normals for clean hull outlines. This goes in the model rules below.

---

## 2. The world: a small island

- **Shape:** flat world (not a planet). One island surrounded by sea. The sea is a natural edge, so it feels open but never ends in a wall. **New places later = new islands or realms** reached by a bridge, boat or portal.
- **Size:** about 250 m across. Walking across takes about 40 s, sprinting about 20 s. Big enough to explore, small enough to always find each other.
- **Scale:** real metres. Characters about 1.7 m tall.
- **Landmarks** (each visible from another, so there's always somewhere to walk to):
  - **The big old tree on a hill:** where you both spawn and meet
  - **A flower meadow** around it
  - **A pond with a little stream** down to the sea
  - **A beach with a wooden pier**, for sitting together at sunset
  - **A small cottage**, which becomes your shared home later
  - **A cliff lookout** with a view over the whole island
- **Ground cover:** stylized grass and flowers, instanced, swaying in the wind, no outlines.

---

## 3. Camera: free orbit (Genshin / Zelda)

Chosen by the owner on 2026-11-08 over the assisted follow camera. You steer the camera yourself, as in Genshin Impact on PC or Zelda: Breath of the Wild. It stays where you put it.

| Setting | Value |
| --- | --- |
| Control | Click the game to capture the mouse (pointer lock, like Genshin on PC). Moving the mouse or trackpad turns the camera with no button held. `Esc` releases the mouse. Dragging also works while the mouse isn't captured |
| Looks at | Character's upper chest, 1.5 m above the feet, centred (no over-the-shoulder offset) |
| Distance | 5 m by default. Scroll or pinch zooms between 2.5 m and 8 m |
| Pitch | 15° looking down by default, limited to between 10° looking up and 70° looking down |
| Field of view | 60° (75° today is wide and stretches the edges) |
| Auto-follow | None. The camera never swings by itself |
| Recenter | One key snaps the camera behind the character, like Zelda's target button (key chosen when we build it) |
| Mouse sensitivity | A setting, because trackpads and mice feel very different |
| Never clips | Stays above the ground and pulls in front of big objects (trees, cottage, cliff) between it and you. More important with free orbit, since you can swing it into anything |
| Far plane | About 300 m. Fog hides everything before that, so the far edge is never drawn |
| Later | Controller (right stick), touch on phones |

Movement stays relative to the camera, as it is now: W always walks away from the camera.

---

## 4. Light and colour: golden afternoon

One fixed time of day.

| Element | Setting |
| --- | --- |
| Sun | Low and warm, about 25° above the horizon. Peach-gold light |
| Sky light | Flat ambient light in the sky colour. Not a hemisphere light: that shades smoothly by surface direction and blurs the two cel tones into a gradient (found in Phase 1). Flat ambient keeps every shadow one even, blue-tinted colour |
| Shadows | One directional shadow map, 2048 px, covering about 60 m around the player and following them. **Crisp edges** (cel style, and cheaper than soft filtering) |
| Sky | Gradient dome, warm peach at the horizon to soft blue overhead, with a glow around the sun |
| Fog | Distance fog in the horizon colour, starting around 60 m, solid by 250 m |
| Post-processing | None in Phase 1 |

Starting palette (tuned in the browser):

| Token | Colour | Use |
| --- | --- | --- |
| `sunlight` | `#ffe4c2` | Sun colour (was `#ffd9a8`, which turned green grass olive) |
| `shadowTint` | `#7a74b8` | What shadows lean towards |
| `skyTop` | `#9cc4ec` | Sky overhead |
| `skyHorizon` | `#ffd2b0` | Horizon and fog |
| `grass` | `#9cc46a` | Meadow base. Shows as about `#a7c969` in sunlight |
| `ink` | `#2b2233` | Outline base (mixed with the surface colour) |

---

## 5. Characters: the two of you

- **Style:** semi-realistic anime proportions, about 6.5–7 heads tall, like Haven's Yu and Kay. Not chibi, not blocky.
- **Made by:** first an attempt with Claude + Blender MCP, since recent AI-built games show it can now do far more than simple props (see "Newer evidence" in `docs/REFERENCES.md`). If the result doesn't reach semi-realistic anime quality, we commission an artist. Either way they can be designed to look like you two. Characters are where quality matters most, so the bar is high.
- **Brief (for Claude or an artist):**
  - 15–25k triangles each, one 2048 px texture, mostly flat colour areas, a separate face material
  - Smooth normals suitable for inverted-hull outlines, no normal maps
  - Humanoid rig on a standard (Mixamo-compatible) skeleton, so animations can be shared and added later
  - Animations: idle, walk, run, sit (bench and ground), wave, hug, walk holding hands, lie down / sleep, a few emotes
  - glTF delivery
- **Until they arrive:** we develop with the current placeholder character, which is already in the repo and only temporary.

---

## 6. World models and props

- **Made by:** Claude + Blender MCP, building props from code with the same rules every time. Blender isn't installed yet.
- **Rules:**
  - Rounded, readable shapes. Clear silhouettes matter more than detail, because outlines and cel shading show the outline of things
  - Colour from a shared palette texture. No unique textures per prop unless it's a hero piece
  - Tree foliage as soft clustered blobs with smoothed normals (the Genshin/Ghibli trick for fluffy cel trees)
  - Triangle budget: prop up to 3k, tree up to 5k, cottage up to 10k
  - Repeated things (flowers, grass, rocks, fence posts) are instanced: one draw call for all of them
  - Exported as glTF and compressed before going into `public/`
- **First test:** one tree and one rock, checked against these rules and measured.
- **Proof it works:** *I Just Wanted to Fish*, a cozy game whose assets were all made by Claude Opus 5.5 through Blender MCP in two weeks.
- **Working tip** (from Nightshoal): use a separate Claude session per modelling task, with the effort level matched to how hard it is.

---

## 7. What this costs (against the budgets in PLAN.md)

| Item | Estimate |
| --- | --- |
| Two characters + outlines | ~50k triangles, ~4–6 draw calls |
| Shadow map | One extra pass over objects near the player |
| Sky + fog | About free |
| Grass and flowers | 1–3 instanced draw calls; triangle count tuned by measuring |
| Props | Under 100 draw calls total thanks to instancing |

Everything above fits the existing budget (under 100 draw calls, under 300k triangles, under 8 ms frame). Each step is measured as it lands.
