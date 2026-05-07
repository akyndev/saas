# TutorialLab

An AI system for turning a prompt and a working codebase into a narrated coding tutorial video.

The first customer is the founder: Joseph, a creator who wants to publish high-quality coding tutorials at scale. The long-term expansion path is creator teams, course creators, and developer-tool companies that need tutorial content for docs, onboarding, and marketing.

## Current Product Thesis

Creators do not only struggle to write code. They struggle to convert finished code into a clean tutorial performance:

- Rebuilding the project from scratch on camera
- Writing a clear voiceover script
- Keeping code, explanation, browser preview, and timing in sync
- Editing long recordings into usable lessons
- Repeating this process often enough to publish consistently

The product should generate the tutorial before it records the tutorial.

## Docs

- [PRD](prd.md)
- [Product Research](docs/research.md)
- [Technical Architecture](docs/technical-architecture.md)
- [MVP Plan](docs/mvp-plan.md)
- [Agent Recording Spec](docs/agent-recording-spec.md)
- [Validation Plan](docs/validation-plan.md)

## First MVP

The first MVP should support small web projects and output a complete MP4 tutorial video.

Initial stack focus:

- HTML, CSS, JavaScript
- React
- Next.js
- Motion-heavy web tutorials using animation libraries such as Framer Motion or GSAP

## Implementation Stack

- Next.js 16.2.4 App Router
- React 19.2.5
- Tailwind CSS 4.2.4
- shadcn/ui 4.7.0 component setup
- Node.js 24
- Controlled browser renderer first
- FFmpeg or Remotion-style rendering for MP4 export later

## Run The MVP App

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Existing Prototype

The current `index.html`, `styles.css`, and `app.js` files are only a visual sketch of the tutorial generator interface. They are not the final product architecture.
# saas
