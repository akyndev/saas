# MVP Plan

## MVP Goal

Generate one usable tutorial video from a small working frontend repo.

The MVP is successful if Joseph would publish the generated video or only lightly edit it before publishing.

## MVP Scope

Input:

- Prompt
- Local repo or uploaded project folder
- Stack selection
- Tutorial length preference
- Explanation depth
- Recording mode

Output:

- MP4 tutorial video
- Voiceover script
- Tutorial plan
- Step timeline JSON
- Source files or generated repo snapshot

## Recommended MVP Path

### Milestone 1: Repo-To-Tutorial Plan

Build a tool that reads a small repo and creates:

- Project summary
- File map
- Build sequence
- Step-by-step lesson plan
- Voiceover draft
- Checkpoints

This validates whether the AI can reconstruct a tutorial from finished code.

### Milestone 2: Timeline Renderer

Create a deterministic timeline:

- At second 0, show intro.
- At second 8, create file.
- At second 12, reveal code block.
- At second 35, switch to browser preview.
- At second 45, play voiceover segment.

This avoids fragile live improvisation.

Current implementation target:

- Next.js app shell
- Typed tutorial timeline model
- Controlled code/terminal/browser stage
- Step navigation for rehearsing tutorial actions

### Milestone 3: Browser-Based Recording

Instead of controlling VS Code first, build or use a controlled browser recording canvas:

- Code editor panel
- Browser preview panel
- Terminal panel
- Animated typing/reveal
- Voiceover playback

This may be more reliable than driving a real desktop.

### Milestone 4: MP4 Export

Record the controlled tutorial scene and export MP4.

Options:

- Browser screen capture
- FFmpeg-based rendering
- Headless browser frame capture
- Remotion-style video rendering

### Milestone 5: Local Agent Later

After the rendered version works, add optional Windows desktop automation for creators who want real VS Code/browser footage.

## Why Not Start With Desktop Automation

Real desktop automation is powerful but brittle:

- VS Code layouts differ.
- Extensions differ.
- Terminal state differs.
- Browser zoom differs.
- Window sizes differ.
- Mouse and keyboard timing can fail.

A controlled browser renderer gives the product a better chance of producing consistent video quickly.

## First Supported Tutorial Type

Small visual frontend project:

- React or Next.js
- 1-8 files
- No complex backend
- Strong browser preview
- Optional animation library

## MVP Settings

- Stack: React, Next.js, HTML/CSS/JS
- Recording mode: hybrid
- Voice: AI voice first
- Voice cloning: future option
- Video length: generated from repo size
- Checkpoints: optional
- Output: MP4 plus files

## Definition Of Done

The MVP is done when:

- User can submit a prompt and repo.
- System creates a tutorial timeline.
- System generates voiceover segments.
- System renders a coding tutorial video.
- Video includes code panel, preview panel, and narration.
- User can export MP4.
- Joseph can use the output for a real YouTube test.

## Features To Avoid Early

- Built-in full video editor
- Multi-project course management
- Enterprise accounts
- Complex backend tutorials
- Automatic voice cloning
- Marketplace of tutorials
- Collaboration features

## First Demo Script

Prompt:

Build a modern animated SaaS landing page with React and motion effects.

Repo:

Small completed React project with:

- Hero section
- Pricing section
- Animated cards
- Responsive layout

Expected output:

- 8-12 minute tutorial video
- Hybrid typing and reveal
- Calm creator-style voiceover
- Browser preview after each major section
