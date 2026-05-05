# Product Requirements Document

## Product Name

Repo-to-Video Tutorial Studio

## One-Liner

Turn a prompt and a working codebase into a narrated coding tutorial video.

## Problem

Coding creators can build projects, but producing tutorial videos is slow. The painful parts are not only writing code. The major bottlenecks are scripting, retyping or reconstructing the project, syncing explanation with code, recording cleanly, and editing the final video.

For a creator trying to publish daily, editing and repeatable recording quality become the limiting factor.

## Founder Use Case

Joseph wants to create YouTube coding tutorials at scale, ideally one per day. The product should help him take a small working repo or project idea and generate a video tutorial with minimal manual work.

## Target Users

Primary first user:

- Individual coding creator
- Wants to publish YouTube tutorials frequently
- May later sell courses
- Prefers practical, visually polished web projects

Primary early market:

- Coding YouTubers
- Indie course creators
- Web design and frontend tutorial creators

Future expansion:

- Developer-tool companies
- DevRel teams
- SaaS companies with SDKs, APIs, docs, and onboarding tutorials
- Bootcamps and course platforms

## Core Insight

The AI should not improvise while recording. It should prepare the full movie first:

1. Understand the prompt and repo.
2. Confirm the finished project works.
3. Break the codebase into a clean tutorial path.
4. Generate voiceover and screen actions.
5. Record or render the tutorial from a timeline.
6. Export video and separate assets.

## Primary Workflow

1. User enters a tutorial prompt.
2. User adds or links a repo.
3. User chooses settings:
   - Stack
   - Tutorial length
   - Typing vs paste/reveal style
   - Voice style or cloned voice
   - Explanation depth
   - Checkpoints on/off
4. AI analyzes the repo.
5. AI verifies or asks user to confirm the repo is working.
6. AI creates a tutorial plan.
7. AI creates a recording timeline.
8. AI generates voiceover segments.
9. Recording engine creates the video.
10. User receives MP4 plus separate files.

## Core Outputs

Required:

- MP4 tutorial video
- Tutorial script
- Voiceover script
- Step-by-step build plan
- Source repo or generated tutorial repo

Nice to have:

- Captions
- Chapter timestamps
- Thumbnail copy ideas
- Description text
- Exported audio track
- Timeline JSON
- Editing project file for external editors

## Must-Have MVP Features

- Accept a small repo or local project folder
- Accept a user prompt describing the tutorial goal
- Generate a tutorial plan from zero to finished project
- Generate a voiceover script synced to each step
- Produce a screen-recorded or rendered MP4
- Support a small set of common frontend stacks
- Allow user to choose typing-style or paste/reveal-style recording
- Export script and code assets separately

## Non-Goals For MVP

- Full video editor
- Multi-user collaboration
- Advanced timeline editor
- Every programming language
- Enterprise team management
- Perfect human-like desktop automation across every machine
- Full voice cloning in the first version unless easy to integrate through an external provider

## Differentiation

This product is not just a ChatGPT wrapper because it performs or renders the tutorial:

- It uses the final working code as the source of truth.
- It reconstructs a zero-to-finish build path.
- It syncs code actions and narration.
- It creates the final video output, not only text.
- It can pause on errors, resolve them, and continue.

## Explanation Modes

The user should be able to choose:

- Important decisions only
- Every line explained
- Beginner-friendly pacing
- Fast creator pacing
- Course-style deep walkthrough

## Recording Modes

Typing mode:

- Code appears as if typed.
- Useful for short tutorials and satisfying creator-style videos.

Paste/reveal mode:

- Larger code blocks appear quickly.
- Voiceover explains the implementation in depth.
- Useful for bigger projects.

Hybrid mode:

- Type important pieces.
- Paste boilerplate or repeated sections.
- Best default for realistic tutorials.

## Initial Stack Support

Phase 1:

- HTML/CSS/JavaScript
- React
- Next.js

Phase 2:

- Framer Motion
- GSAP
- Tailwind CSS
- Shadcn/UI

Phase 3:

- Backend/API tutorials
- Authentication tutorials
- Database tutorials
- Full-stack SaaS tutorials

## Business Model

Recommended initial pricing:

- Free trial with watermark or limited duration
- Creator plan: monthly credits
- Extra videos: pay-per-video credits

Possible pricing tests:

- $29 per exported video
- $99/month for a creator plan
- Higher usage tiers for course creators

Future company pricing:

- $500-$2,000/month for dev-tool companies and DevRel teams that need repeatable tutorial production.

## Success Metrics

Creator success:

- Time from repo to first video
- Manual editing time saved
- Number of publishable videos per week
- User willingness to publish the output under their own brand

Product success:

- Percentage of generated videos that need little or no editing
- Percentage of tutorials where code runs correctly
- Average time to export
- Retention by creators publishing weekly

## Biggest Risks

- Video generation is technically harder than script generation.
- Desktop automation may be brittle across machines.
- AI-generated tutorial steps may skip important context.
- Voiceover timing may drift from code actions.
- Early users may expect professional editing quality.
- Individual creators may have lower willingness to pay until they make money.

## Hard Product Rule

The core feature is video tutorial generation. If the product cannot output a usable tutorial video, it is not the product Joseph wants to build.
