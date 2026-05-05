# Agent Recording Spec

## Purpose

The recording agent creates the final tutorial video from an approved tutorial timeline.

The agent should not invent the tutorial while recording. It should execute a prepared plan.

## Preferred MVP Agent

Use a controlled browser-based recording stage first.

The stage should visually imitate a coding tutorial setup:

- Code editor on one side
- Browser preview on the other side
- Terminal panel when needed
- Voiceover audio
- Captions optional
- Smooth code typing or reveal animation

## Future Windows Agent

The Windows agent can later control:

- VS Code
- Browser
- Terminal
- OBS or FFmpeg

Possible tools:

- Python for orchestration
- Playwright for browser control
- pywinauto for Windows app control
- pyautogui for keyboard and mouse fallback
- VS Code CLI for opening folders and files
- OBS WebSocket or FFmpeg for recording

## Window Layout

Default layout:

- VS Code or editor stage on the left
- Browser preview on the right
- Terminal appears at bottom only when useful

User preferences:

- Font size
- Theme
- Typing speed
- Keyboard sound on/off
- Voice style
- Explanation depth

## Recording Modes

### Typing Mode

Code appears character by character.

Best for:

- Short lessons
- Important concepts
- Satisfying tutorial pacing

### Paste/Reveal Mode

Code appears in blocks.

Best for:

- Large files
- Repeated UI sections
- Boilerplate
- Advanced tutorials where explanation matters more than watching every character

### Hybrid Mode

Type important code and reveal less important blocks.

Default recommendation.

## Timeline Actions

Supported action types:

- `open_file`
- `create_file`
- `type_code`
- `reveal_code`
- `run_command`
- `show_browser`
- `refresh_browser`
- `scroll`
- `pause`
- `play_voiceover`
- `show_caption`
- `zoom_focus`
- `checkpoint`

## Sync Rules

- Every voiceover segment belongs to a visible action or pause.
- Long code reveals should be followed by explanation.
- Browser preview moments should happen after meaningful visual progress.
- Terminal commands should be narrated before or while they run.
- The system should avoid silent dead time unless intentionally paced.

## Error Behavior

During MVP rendering:

- Avoid showing live errors unless they are part of the planned tutorial.
- If code cannot render, stop generation and show the issue.

During future live desktop automation:

- Pause recording if a real error appears.
- Attempt diagnosis.
- Ask user before modifying repo if fix is not obvious.
- Resume from the last successful timeline checkpoint.

## Exported Assets

Required:

- Final MP4
- Voiceover script
- Tutorial timeline JSON
- Tutorial Markdown

Optional:

- Audio-only track
- Captions file
- Code snapshots per step
- Video chapter timestamps

## Quality Bar

The final video should be:

- Coherent without manual explanation
- Good enough to publish after light review
- Free of obvious timing drift
- Clear enough for beginners to follow
- Visually close to a normal coding tutorial
