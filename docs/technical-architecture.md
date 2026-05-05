# Technical Architecture

## Architecture Principle

Generate the tutorial movie before recording or rendering it.

The system should produce a deterministic timeline with code actions, voiceover, preview moments, pauses, and checkpoints. The renderer or automation agent should execute that timeline.

## High-Level Pipeline

```text
User prompt + repo
        ↓
Repo analyzer
        ↓
Project verifier
        ↓
Tutorial planner
        ↓
Voiceover generator
        ↓
Timeline builder
        ↓
Renderer or desktop agent
        ↓
MP4 + assets
```

## Main Components

### Web App

Responsibilities:

- Collect prompt and settings
- Upload or connect repo
- Show generated plan
- Let user approve or regenerate
- Trigger video generation
- Provide exported files

### Repo Analyzer

Responsibilities:

- Read project files
- Identify stack
- Identify entry points
- Summarize file responsibilities
- Detect important components
- Ignore dependencies, build output, and generated files

### Project Verifier

Responsibilities:

- Install dependencies if needed
- Run build or dev server
- Capture errors
- Confirm expected output when possible
- Ask user to fix repo if it fails

For the earliest version, the user can confirm the repo works. Later versions should run verification automatically.

### Tutorial Planner

Responsibilities:

- Convert final code into a zero-to-finish tutorial sequence
- Decide which code is typed, pasted, or revealed
- Add checkpoints
- Split large projects into episodes if needed
- Generate beginner-friendly explanations

### Voiceover Generator

Responsibilities:

- Generate narration per step
- Match explanation depth
- Estimate timing
- Create optional captions
- Support AI voice first and voice cloning later

### Timeline Builder

Responsibilities:

- Convert tutorial plan into timeline JSON
- Attach each voiceover segment to code actions
- Define panel switches, pauses, scrolls, and preview moments
- Ensure audio and visuals stay synchronized

### Video Renderer

Recommended first implementation:

- Controlled browser-based tutorial stage
- Code panel
- Browser preview panel
- Terminal panel
- Animated typing and reveal
- Voiceover playback
- MP4 export

Alternative later implementation:

- Windows desktop agent controlling VS Code and browser

## Timeline JSON Concept

```json
{
  "title": "Build an Animated SaaS Landing Page",
  "durationTarget": "12 minutes",
  "steps": [
    {
      "id": "step-001",
      "title": "Create the project",
      "mode": "terminal",
      "actions": [
        { "type": "command", "value": "npm create vite@latest" },
        { "type": "pause", "durationMs": 1000 }
      ],
      "voiceover": "We will start by creating a fresh React app...",
      "checkpoint": "The dev server starts without errors."
    }
  ]
}
```

## Browser Renderer vs Real Desktop Agent

### Browser Renderer

Pros:

- More reliable
- Easier MP4 export
- Consistent layout
- Easier to sync voice and visuals
- No dependency on a user's VS Code setup

Cons:

- Less authentic than real VS Code
- Needs a convincing coding interface
- Browser preview may need sandboxing

### Real Desktop Agent

Pros:

- Feels authentic
- Uses the creator's actual tools
- Can record real development workflow

Cons:

- Brittle
- Harder to support
- Depends on local machine state
- Harder to make deterministic

## Recommendation

Start with a browser-based renderer. Add a Windows desktop agent later as an advanced mode.

## Suggested Tech Stack

Frontend:

- Next.js 16.2.4 App Router
- React 19.2.5
- Tailwind CSS 4.2.4
- shadcn/ui 4.7.0 component setup
- Monaco Editor later for richer code display

Backend:

- Node.js 24 for orchestration
- Python worker optional for repo analysis and video tools

AI:

- LLM for repo analysis, tutorial planning, and scripts
- TTS provider for voice generation

Video:

- Controlled browser renderer first
- Remotion-style rendering or browser capture
- FFmpeg for final encoding

Automation Later:

- Python
- Playwright
- pywinauto or pyautogui
- OBS WebSocket or FFmpeg

## Verification Strategy

Early:

- User confirms repo works.
- System performs static analysis.
- System creates tutorial from known files.

Next:

- Run install/build command.
- Capture errors.
- Let AI suggest fix.
- Stop and ask user if fix requires repo changes.

Later:

- Run app in sandbox.
- Use Playwright to inspect preview.
- Capture screenshots for key checkpoints.

## Error Handling

If repo verification fails:

1. Stop.
2. Show error.
3. Suggest likely fix.
4. Let user fix repo or approve AI fix.
5. Resume from the failed step.

If rendering fails:

1. Save timeline state.
2. Retry the failed segment.
3. Export partial logs.
4. Avoid losing the full generation.
