# Urosphere references (Phase 1 discussion)

A reference board for deciding how the world looks, feels and is viewed.

> **Decided 2026-11-08:** anime cel shading with ink outlines, semi-realistic characters, a golden-hour island and a free orbit camera like Genshin and Zelda (the owner picked this over the assisted follow I proposed). The decisions live in `docs/ART_DIRECTION.md`. This file stays as the research behind them. The "my lean" notes below are what was proposed before the owner chose Haven + anime outlines.

---

## What we know so far

From the owner, 2026-11-08:

- **Time of day:** one fixed time for now. Later: a day/night cycle where you can both go to sleep to skip to morning instead of waiting.
- **Mood:** cozy, cute, two people having a really fun time together.
- **Setting:** not decided yet. Later the world grows into more places ("realms"), but first we nail the building blocks: solo play, then multiplayer.
- **World:** open world, small for now, built so we can keep adding places to explore.
- **Art:** stylized and animated-looking, clearly better than the current blocky character. Not realistic: too expensive to render and not cute enough.
- **Players:** made for a couple. Two characters, one for each of you.
- **Models:** our own, not free asset packs. Try Blender MCP + Claude.

---

## 1. Games closest to what you described

### Best single reference: play this one together

| Game | Why it matters |
| --- | --- |
| **[Messenger](https://messenger.abeto.co)** by Abeto (2025, free, in the browser) | Almost exactly our tech: a cozy, cute world in **three.js with no game engine**, real players walking around together, about 5.7 MB to load, runs on phones. A tiny planet you can run around in 30 seconds. Made by a two-person team with Blender/Houdini and Substance, multiplayer over WebSocket/Node. Proof that what we want is possible in a browser. ([80.lv write-up](https://80.lv/articles/deliver-mail-on-tiny-colorful-planet-in-this-relaxing-web-game), [Aftermath](https://aftermath.site/messenger-browser-game-abeto)) |

**Homework:** open it on both your laptops at the same time and see if you can find each other. 10 minutes will teach us a lot about camera, scale and feel.

### Made for two people together

| Game | What's close | What to look at |
| --- | --- | --- |
| **[Sky: Children of the Light](https://store.steampowered.com/app/2325290/)** (thatgamecompany) | Gentle social exploration with friends, a decoratable home space, painterly look | Light, sky and clouds, the soft dreamy colour, how two players move together. ([art interview](https://80.lv/articles/interview-a-deep-dive-into-the-art-of-sky-children-of-the-light-with-thatgamecompany)) |
| **Haven** (The Game Bakers, 2020) | Literally a game about a couple exploring an open world together | Soft cel-shaded look, bright colours, the two characters' design and chemistry. Local co-op only. ([PC Gamer review](https://pcgamer.com/haven-review)) |
| **[Palia](https://palia.com)** | Cozy shared online world for friends and couples | Cute stylized characters and a gentle, readable world |
| **Animal Crossing: New Horizons** | The classic "our little island" feeling | Fixed camera angle, chunky cute shapes, how little detail you need for "cozy" |

### Small, cozy open worlds (the scale we're starting at)

| Game | What's close | What to look at |
| --- | --- | --- |
| **[A Short Hike](https://store.steampowered.com/app/1055540/)** | The gold standard for a small, open, cozy island you just wander | Size of the world, how the camera trails you, how few things you need to make it feel full |
| **[Lil Gator Game](https://store.steampowered.com/app/1586800/)** | Bright, cute, Zelda-like island exploration | Bright cartoon colours, the cute character, playful movement |
| **[Tchia](https://store.steampowered.com/app/1496590/)** | Cozy tropical open world, very warm | Water, warm light, a stylized but rich world |
| **[Alba: A Wildlife Adventure](https://store.steampowered.com/app/1337010/)** | Small Mediterranean island, simple shapes, lovely light | How good simple low-poly can look with the right light and colour |
| **Little Kitty, Big City** | Small, dense, cute open world | Cute character, playful scale |
| **Smushi Come Home** | Tiny mushroom character in a big cute forest | Cozy forest mood, soft colours |

### Big open-world look (if you want it to feel "AAA")

| Game | What to look at |
| --- | --- |
| **Zelda: Breath of the Wild / Tears of the Kingdom** | Painterly cel shading, wind in the grass, the free orbit camera, how fog and distance sell "open world" |
| **[Genshin Impact](https://genshin.hoyoverse.com)** | Anime cel shading, rim lighting on characters, the AAA third-person camera |
| **Infinity Nikki** | Very cute, very pretty open world with soft pastel light |

---

## 2. Art style options

The styles from cheapest to render to most expensive. Every one can look premium. What sells "cozy" is shape, colour and light more than detail.

| Style | Looks like | How it's done | Cost |
| --- | --- | --- | --- |
| **A. Chunky cute + great light** | A Short Hike, Lil Gator, Alba, Animal Crossing | Simple rounded shapes, flat colours from one small palette texture or vertex colours, soft lighting, fog | Cheapest. Tiny files, few textures, lots of headroom for grass/flowers |
| **B. Soft toon (cel) shading** | Haven, Genshin, Zelda | Lighting snapped into 2–3 soft bands with a gradient ramp (`MeshToonMaterial` or a custom shader), rim light on characters, optional outlines | Cheap. Outlines cost an extra draw of each outlined object |
| **C. Painterly / hand-painted** | Sky, Messenger, Tchia | Hand-painted textures (or Substance), soft gradients, lots of atmosphere | Medium: more and bigger textures to download and keep in memory |
| **D. Watercolor / Ghibli filter** | [craftzdog's Ghibli shader](https://awesome.ecosyste.ms/projects/github.com%2Fcraftzdog%2Fghibli-style-shader), [Susurrus](https://tympanus.net/codrops/2026/04/24/susurrus-crafting-a-cozy-watercolor-world-with-three-js-and-shaders/) | Full-screen post-processing filters over the image | Expensive: full-screen passes at our resolution every frame |

### 3D drawn like anime: ink outlines and flat colour (the chosen direction)

Games where 3D models are rendered to look like hand-drawn anime, with black or ink outlines and flat colour instead of realistic shading:

| Game | What to look at |
| --- | --- |
| **Haven** | The owner's favourite. Soft cel shading, bright colours, semi-realistic couple |
| **Guilty Gear Xrd / Strive** (Arc System Works) | The famous "you can't tell it's 3D" anime look. Custom cel shaders, hand-tuned lighting per character, no normal maps. Their GDC 2015 talk explains how ([GDC Vault](https://gdcvault.com/play/1022031/GuiltyGearXrd-s-Art-Style-The), [handout PDF](https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf)). Also Dragon Ball FighterZ and Granblue Fantasy Versus from the same studio |
| **Sable** (Shedworks) | Moebius comic style: flat colour, almost no shading, lines and fog do all the depth. A whole open world drawn this way ([Game Developer](https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability)) |
| **Genshin Impact, Honkai: Star Rail, Zenless Zone Zero** (HoYoverse) | Anime cel on semi-realistic characters with outlines and rim light, in a full open world. The closest to our characters |
| **Hi-Fi Rush** | Bold cartoon outlines and flat colour, very clean |
| **Jet Set Radio** | The game that started cel shading with black outlines |
| **Ni no Kuni** | Studio Ghibli look in 3D, soft cel with gentle outlines |
| **Zelda: The Wind Waker** | Cartoon cel shading, cute rather than anime |

**My lean (before the decision):** **A + B together.** Simple, rounded, cute shapes with soft toon lighting and a rim light on the characters, plus lots of instanced grass and flowers moving in the wind ([fluffy grass in three.js](https://tympanus.net/codrops/2025/02/04/how-to-make-the-fluffiest-grass-with-three-js/)). Cheapest per pixel, very cute, and it's the style our own models can reach (see section 5). Bits of C can come later as "looks on top".

**Question for you two:** which screenshots make you say "that one"? Characters especially, since the characters set the style for everything else.

---

## 3. Camera

| Option | Like | Good | Not so good |
| --- | --- | --- | --- |
| **1. Free orbit (AAA)** | Zelda, Genshin, Tchia | Full freedom, feels "open world" | Needs constant mouse or stick control. Awkward on a laptop trackpad. Needs camera collision with hills and trees. Shows more world, so more to render |
| **2. Assisted follow** | A Short Hike, Lil Gator, Sky, Messenger | Camera trails behind and gently swings to where you're walking. You *can* turn it, but you don't have to. Cozy and accessible | Less precise control. Needs tuning to feel good |
| **3. Fixed angle** | Animal Crossing | Simplest, diorama-like, very cute, and the cheapest to render (we control exactly what's visible) | Less "open world". You can't look at the horizon |

Today we have option 1 without any automatic following: the camera only turns when you drag.

**My lean:** **option 2**, with free orbit on drag for when you want it. It keeps the open-world feel, it's relaxing for someone who doesn't play many games, and it works on a trackpad. Things to tune together: distance, height, zoom, and how fast it swings back behind you.

**Questions:**
- Does she play games much, or is this a gentle first one?
- Will you both use laptops with trackpads, a mouse, or a controller? Trackpads strongly favour option 2 or 3.

---

## 4. Light and colour (one time of day)

| Mood | Like | Feels |
| --- | --- | --- |
| **Golden hour** (late afternoon) | Sky, Messenger, Tchia | Warm, romantic, long soft shadows |
| **Soft bright day** | Animal Crossing, Lil Gator, A Short Hike | Cheerful, playful, very readable |
| **Pastel dawn / dusk** | Infinity Nikki, Sky | Dreamy, pink-purple, gentle |

How it's built, with cost:

- **Sun + sky light:** one directional "sun" and a hemisphere light (sky colour above, ground colour below). Cheap.
- **Shadows:** one shadow map that follows the player, covering only what's near. One extra pass over nearby objects. Needed for anything to feel grounded.
- **Gradient sky:** a simple shader dome. Nearly free.
- **Fog:** distance fog in the sky's colour. Nearly free, and it's a performance *win*: it hides the far edge, so we can skip drawing far objects.
- **Toon ramp + rim light:** part of the materials, cheap.
- **Bloom, colour grading:** full-screen post-processing. Real cost at our resolution, so later and only if measured.

**My lean:** a **warm golden afternoon** (romantic but still bright enough to read), pastel-leaning palette, fog, gradient sky, one following shadow, and no post-processing at first.

---

## 5. Making our own models

Honest state of the tools, late 2026:

| Approach | Good at | Weak at |
| --- | --- | --- |
| **Claude + Blender MCP** (Claude controls Blender through Python) | Building props from code: rocks, fences, trees, houses, terrain pieces. Assembling scenes, setting up materials, batch export to glTF, cutting triangle counts, consistent naming | Organic shapes (faces, bodies), clean topology, rigging, animation. Reviewers consistently say output needs manual cleanup for production, and a Claude-modelled head comes out "head-shaped" but unusable. ([MindStudio](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance), [Peerlist](https://peerlist.io/ll555/articles/blender-ai-plugin-blender-mcp-3d-agent)) |
| **AI 3D generators** (Tripo, Meshy, Rodin, Hunyuan3D) | Stylized characters and props from a text prompt or a drawing. Some auto-rig. Rodin and Tripo are rated best for stylized characters ([comparison](https://wavect.io/blog/ai-3d-model-generators-game-development-2026/)) | Meshes too dense for real time, messy topology and UVs, needs cleanup and slimming. Quality varies. Check each tool's licence for what you're allowed to do with the output |
| **Modelling by hand in Blender** | Full control, exactly your style, a great skill to learn | Slow at first. Characters, rigging and animation are the hardest part |
| **Commissioning an artist** for the two characters | The highest quality, and they could actually look like you two. Delivered rigged and animated | Costs money. You rely on someone else's timeline |

### Newer evidence (videos the owner shared, autumn 2026)

The reviews above are mostly from earlier model versions. Two recent videos from the Stefan 3D AI channel show a big jump. The channel sells courses and uses affiliate links (Tripo, Higgsfield), so treat its enthusiasm with some care. The games themselves are real and playable.

- **[This Game Was Built Only With AI in 11 Weeks](https://www.youtube.com/watch?v=6a5VLKPlJRo)** (Oct 2026), reviewing viewers' AI-built games:
  - **I Just Wanted to Fish** ([Steam](https://store.steampowered.com/app/5350560/I_Just_Wanted_to_Fish/)) is a cozy fishing game with a lovely calm atmosphere. One developer, two weeks, **Claude Opus 5.5 + Blender MCP only: no AI image or 3D generators.** Claude built every asset in Blender. This is the closest proof for our plan.
  - **Emberfall**: an HD pixel-art diorama RPG in the browser where every asset is drawn by code. The first version took under a day, and the build was 3.5 MB.
  - **Nightshoal** ([itch.io](https://profactor.itch.io/nightshoal)) was made in 11 weeks with Claude in Godot. **Tripo for complex models, procedural code for simple ones.** The developer used separate Claude sessions per task, with the effort level matched to how hard each task was, to keep cost down.
  - The reviewer makes ~90% of his own game's models with Tripo, using its "smart UV" output to recolour textures quickly (e.g. team colour variants).
- **[New Absolute King of 3D & Blender - GPT-6 Astra](https://www.youtube.com/watch?v=8MUk-tQTiwE)** (Sep 2026): GPT-6 driving Blender through the Higgsfield plugin (Codex CLI + Higgsfield MCP). It builds environments, rebuilds scenes from a reference image, assembles a car from blueprints, and **rigs and animates a four-legged character**. The reviewer shows the failures too.

**What this changes for us:** Claude + Blender MCP can now plausibly make the *whole* world, not just simple props. AI rigging and animation is becoming real. It's worth **trying the characters with Claude + Blender MCP first**, and commissioning only if they can't reach semi-realistic anime quality. A hybrid (generator for the hardest models, code for the rest) is a proven fallback.

**My suggestion (updated):**

- **World and props:** Claude + Blender MCP, made from code with a shared look (one palette texture, rounded shapes, strict triangle limits). This is where it's strong, and simple shapes suit style A + B.
- **The two characters:** the one place where quality matters most and AI is weakest. Either commission them, or generate a base from a drawing of the two of you with an AI generator, then clean it up, rig it and animate it in Blender.
- **First test before deciding:** install Blender + Blender MCP (not on this Mac yet), then have Claude build one tree and one rock in our style while we time it and check triangle counts.

**Performance rules for every model** (first draft): a character under 10k triangles, a prop under 2k, textures 1024px or less, shared palette textures wherever possible, glTF compressed before it goes into `public/`.

---

## 6. How to give feedback

For each reference you look at, a line like this is perfect:

> **A Short Hike:** world size ❤️, camera ❤️, art "too pixelated"
> **Sky:** light and colour ❤️❤️, characters meh

Then we fill in the decisions in `docs/PLAN.md` one at a time.
