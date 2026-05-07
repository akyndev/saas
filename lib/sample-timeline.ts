import type { TutorialBrief, TutorialTimeline } from "@/lib/tutorial-types";

const stackCommands = {
  React: "npm create vite@latest motion-site -- --template react-ts\ncd motion-site\nnpm install\nnpm run dev",
  "Next.js": "npx create-next-app@latest motion-site\ncd motion-site\nnpm run dev",
  "HTML/CSS/JS": "mkdir motion-site\ncd motion-site\nni index.html styles.css app.js",
};

const starterCode = {
  React: `import { useState } from "react";
import "./App.css";

const features = ["Fast exports", "Synced voiceover", "Clean code playback"];

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Repo-to-video studio</p>
        <h1>Turn finished code into tutorial videos.</h1>
        <p className="lede">
          Generate the plan, code performance, and voiceover before recording.
        </p>
        <div className="feature-row">
          {features.map((feature, index) => (
            <button key={feature} onClick={() => setActive(index)}>
              {feature}
            </button>
          ))}
        </div>
        <strong>{features[active]}</strong>
      </section>
    </main>
  );
}`,
  "Next.js": `export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Repo-to-video studio</p>
        <h1>Turn finished code into tutorial videos.</h1>
        <p>
          Generate the plan, code performance, and voiceover before recording.
        </p>
      </section>
    </main>
  );
}`,
  "HTML/CSS/JS": `<main class="page-shell">
  <section class="hero">
    <p class="eyebrow">Repo-to-video studio</p>
    <h1>Turn finished code into tutorial videos.</h1>
    <p>Generate the plan, code performance, and voiceover before recording.</p>
  </section>
</main>`,
};

const stylesCode = `.page-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px;
  background: #f4f7f6;
}

.hero {
  max-width: 760px;
}

.eyebrow {
  color: #0d776d;
  font-weight: 800;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(44px, 8vw, 84px);
  line-height: 0.95;
  margin: 12px 0;
}

.lede {
  color: #63716d;
  font-size: 20px;
}`;

export function buildSampleTimeline(brief: TutorialBrief): TutorialTimeline {
  const isDeep = brief.explanationDepth !== "important";
  const repoName = brief.repoName.trim() || "motion-site";

  return {
    title: brief.title,
    stack: brief.stack,
    recordingMode: brief.recordingMode,
    explanationDepth: brief.explanationDepth,
    estimatedMinutes: brief.targetMinutes,
    summary:
      `Generated from ${repoName}. This timeline is the MVP rehearsal format: terminal actions, code playback, browser preview, and voiceover segments stay tied together before MP4 rendering.`,
    steps: [
      {
        id: "step-1",
        title: "Create the project and start the dev server",
        objective: "Begin from zero so the viewer sees the same starting point.",
        voiceover:
          "We will start from a blank folder and create the project. This gives the tutorial a clean baseline, and it also proves the viewer can follow without downloading hidden starter files.",
        checkpoint: "The development server starts without errors.",
        actions: [
          {
            type: "terminal",
            label: "Run setup commands",
            command: stackCommands[brief.stack],
            durationSeconds: 18,
          },
        ],
      },
      {
        id: "step-2",
        title: "Build the first visible screen",
        objective: "Create a working page before adding polish or animation.",
        voiceover: isDeep
          ? "Now we create the first visible screen. Notice that the structure is intentionally simple: one outer page shell, one hero section, and text that clearly explains the offer. We want the browser to show progress early."
          : "Now we create the first screen. The goal is simple: get something meaningful in the browser before we start polishing.",
        checkpoint: "The browser shows a hero section with a clear headline.",
        actions: [
          {
            type: "code",
            label: "Add the page structure",
            file:
              brief.stack === "Next.js"
                ? "app/page.tsx"
                : brief.stack === "React"
                  ? "src/App.tsx"
                  : "index.html",
            code: starterCode[brief.stack],
            durationSeconds: brief.recordingMode === "typing" ? 64 : 24,
          },
          {
            type: "preview",
            label: "Preview first screen",
            previewTitle: "Repo-to-video studio",
            previewBody: "Turn finished code into tutorial videos.",
            durationSeconds: 8,
          },
        ],
      },
      {
        id: "step-3",
        title: "Style the layout for a publishable tutorial moment",
        objective: "Make the preview visually strong enough to justify the lesson.",
        voiceover:
          "With the structure in place, we can style the page. This is where the tutorial starts to feel like a real creator video: the code change is small, but the visual result is obvious.",
        checkpoint: "The layout has strong spacing, readable text, and a polished first viewport.",
        actions: [
          {
            type: "code",
            label: "Add layout styles",
            file:
              brief.stack === "Next.js"
                ? "app/globals.css"
                : brief.stack === "React"
                  ? "src/App.css"
                  : "styles.css",
            code: stylesCode,
            durationSeconds: brief.recordingMode === "typing" ? 54 : 22,
          },
          {
            type: "preview",
            label: "Preview polished layout",
            previewTitle: "Publishable first viewport",
            previewBody:
              "The controlled renderer can cut back to preview moments after each meaningful step.",
            durationSeconds: 10,
          },
        ],
      },
      {
        id: "step-4",
        title: "Finish with a verification pass",
        objective: "End the video by proving the project works.",
        voiceover:
          "Before we wrap, we do a quick verification pass. For this MVP, the important habit is that every tutorial ends with the code running and the viewer knowing exactly what should be on screen.",
        checkpoint: "Final video has code, preview, narration, and a clear ending.",
        actions: [
          {
            type: "terminal",
            label: "Run production check",
            command: brief.stack === "HTML/CSS/JS" ? "Open index.html and inspect the page" : "npm run build",
            durationSeconds: 12,
          },
          {
            type: "preview",
            label: "Final preview",
            previewTitle: "Tutorial complete",
            previewBody:
              "Next step: export this timeline as MP4 with audio, captions, and code snapshots.",
            durationSeconds: 10,
          },
        ],
      },
    ],
  };
}
