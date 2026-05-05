# Product Research

## Research Question

Can an AI product help coding creators generate high-quality tutorial videos from a prompt and a working repo, with enough quality to reduce scripting, recording, and editing time?

## Founder Thesis

The first user is Joseph. Joseph wants to publish coding tutorials at scale, ideally one tutorial per day. The biggest pain is editing and reconstructing the tutorial process after the code already works.

The product should make tutorial creation feel closer to pressing "render" than manually recording and editing from scratch.

## Current Creator Workflow

A typical coding tutorial creator often does some version of this:

1. Build the project.
2. Debug until it works.
3. Decide how to explain it.
4. Rebuild it on camera or record sections.
5. Write or improvise voiceover.
6. Capture browser previews.
7. Edit mistakes, pauses, restarts, and dead time.
8. Export and upload.

The painful parts are:

- Repeating code that already exists
- Making the explanation beginner-friendly
- Avoiding mistakes during recording
- Syncing voice with code
- Editing long footage
- Turning large repos into multiple coherent videos

## Core Opportunity

AI is strongest when it can use the final working repo as the source of truth. Instead of guessing a tutorial, the system can analyze working code and reconstruct a tutorial path backward.

This creates a better workflow:

1. Start with working code.
2. Generate the tutorial plan.
3. Generate screen actions and voiceover.
4. Produce the video.

## Best First Customer

Individual creator first.

Reasons:

- Joseph is the first user and can validate the product personally.
- Creator workflows are easier to observe directly.
- The product can start with small web projects.
- Creator content has visible output, so quality can be judged quickly.

## Future Expansion Customer

Developer-tool companies.

Examples:

- API startups
- SaaS platforms
- SDK companies
- Design/dev tools
- Auth, payment, database, deployment, and AI infrastructure companies

Why they may pay more:

- They need tutorials for product education.
- Better tutorials can improve developer adoption.
- They already spend on content, DevRel, docs, and marketing.
- They need repeatable tutorial generation for new releases.

## Positioning Options

Strong:

- Upload a repo. Get a narrated coding tutorial video.
- Turn finished code into a YouTube-ready tutorial.
- Generate coding tutorial videos from working repos.

Too broad:

- AI tutorial generator
- AI coding teacher
- AI course creator

Best current positioning:

**Turn any working frontend repo into a narrated coding tutorial video.**

## MVP Wedge

The MVP should focus on small frontend tutorials because they are visual, fast to verify, and match Joseph's likely content direction.

Best initial tutorial types:

- Portfolio landing pages
- Motion websites
- SaaS landing pages
- React components
- Next.js UI projects
- Animated Awwwards-style sections

## Key Product Bet

The final output must be video, not just a script. Scripts are useful, but video generation is the main reason the product exists.

## Competitive Alternatives

Manual workflow:

- Cursor or ChatGPT for code help
- VS Code for coding
- OBS for recording
- ElevenLabs or similar for voiceover
- CapCut, Premiere, DaVinci Resolve, or Final Cut for editing

Why users might switch:

- One workflow instead of many tools
- Less editing
- Synchronized voiceover and code
- Finished video from a repo

Why users might not switch:

- They want full creative control.
- They distrust AI-recorded content.
- They prefer their own editing style.
- Output quality may not match their channel.

## Critical Assumptions

- Creators care more about reducing editing time than controlling every pixel.
- A tutorial generated from a working repo can be accurate enough to publish.
- Screen actions can be rendered or automated in a controlled way.
- Voiceover timing can be synced well enough for a tutorial.
- Individual creators will pay if the product reliably saves hours.

## Open Questions

- Should the first implementation control VS Code, or use a browser-based code playback renderer?
- How important is realistic typing compared to clean pacing?
- Should errors be shown as part of the tutorial, or hidden from the final video?
- Should users be able to split a large repo into multiple episodes?
- What is the minimum video quality Joseph would publish publicly?
