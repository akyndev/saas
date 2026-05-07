import type {
  CodebaseAnalysis,
  RebuildPlan,
  StoredProject,
  TtsPackage,
  VideoTimeline,
  VoiceoverScript,
} from "@/lib/project-types";

type GitTreeItem = {
  path: string;
  size?: number;
  type: "blob" | "tree" | string;
};

export function createRebuildPlan(project: StoredProject): RebuildPlan {
  if (!project.analysis) {
    throw new Error("Understand the codebase first, then generate the build plan.");
  }

  const { analysis } = project;
  const stack = analysis.stack.filter((item) => item !== "Unknown").join(", ") || "the detected stack";
  const entryFiles = analysis.entryPoints.length > 0 ? analysis.entryPoints : ["main app entry"];
  const styleFiles = analysis.keyFiles
    .map((file) => file.path)
    .filter((path) => path.includes("css") || path.includes("tailwind"));
  const componentFiles = analysis.keyFiles
    .map((file) => file.path)
    .filter((path) => path.includes("component") || path.includes("app/") || path.includes("src/"));
  const scripts = Object.keys(analysis.scripts);

  return {
    chapters: [
      {
        id: "setup",
        objective: "Recreate the project foundation from a blank folder.",
        steps: [
          {
            checkpoint: scripts.includes("dev")
              ? `The project starts successfully with the dev script: ${analysis.scripts.dev}.`
              : "The project installs and has a clear local run command.",
            files: ["package.json"],
            id: "setup-project",
            objective: `Create the project using ${analysis.packageManager ?? "the package manager"} and install the core ${stack} dependencies.`,
            title: "Start from an empty project",
            voiceoverAngle:
              "Explain that we are starting from a clean project and building toward the finished result step by step.",
          },
          {
            checkpoint: "The folder structure is ready for the rest of the tutorial.",
            files: compactFiles([...entryFiles, "components", "styles"]),
            id: "setup-structure",
            objective: "Create the folders and starter files that the rest of the tutorial will grow into.",
            title: "Lay out the project structure",
            voiceoverAngle:
              "Show the audience where each part of the app will live before writing the detailed implementation.",
          },
        ],
        title: "Project setup",
      },
      {
        id: "app-shell",
        objective: "Build the first visible screen and routing shell.",
        steps: [
          {
            checkpoint: "The browser shows the first working version of the main screen.",
            files: entryFiles,
            id: "build-entry",
            objective: "Recreate the main entry point and render the first version of the app screen.",
            title: "Build the entry screen",
            voiceoverAngle:
              "Narrate the core layout decisions first so viewers understand the shape of the finished app.",
          },
          {
            checkpoint: "Navigation, layout spacing, and page sections are visible without final polish.",
            files: compactFiles(componentFiles.length > 0 ? componentFiles : entryFiles),
            id: "build-layout",
            objective: "Split the screen into reusable layout pieces once the first page becomes too large.",
            title: "Extract the reusable layout",
            voiceoverAngle:
              "Explain why the code moves into components at the moment duplication or readability becomes a problem.",
          },
        ],
        title: "Application shell",
      },
      {
        id: "styling",
        objective: "Apply the visual system that makes the finished app feel polished.",
        steps: [
          {
            checkpoint: "Typography, spacing, colors, and core responsive behavior are in place.",
            files: compactFiles(styleFiles.length > 0 ? styleFiles : ["globals.css", "tailwind config"]),
            id: "style-foundation",
            objective: "Add global styles, theme tokens, and responsive rules before polishing individual sections.",
            title: "Set up the styling foundation",
            voiceoverAngle:
              "Call out the visual rules that matter most so the tutorial does not become random CSS typing.",
          },
          {
            checkpoint: "The main interface looks close enough to start validating behavior.",
            files: compactFiles([...componentFiles, ...styleFiles]),
            id: "style-polish",
            objective: "Polish the components to match the finished spacing, hierarchy, and interaction states.",
            title: "Polish the interface",
            voiceoverAngle:
              "Point out the important before-and-after visual changes instead of narrating every CSS property.",
          },
        ],
        title: "Design and polish",
      },
      {
        id: "behavior",
        objective: "Recreate the behavior and data flow that makes the app actually work.",
        steps: [
          {
            checkpoint: "The main user action works from input to visible result.",
            files: compactFiles(componentFiles.length > 0 ? componentFiles : entryFiles),
            id: "wire-behavior",
            objective: "Connect state, events, and data fetching around the core workflow.",
            title: "Wire the main workflow",
            voiceoverAngle:
              "Explain each state change as a user story: what the user does, what the app stores, and what updates on screen.",
          },
          {
            checkpoint: "The rebuilt project has a clear final demo and no obvious broken states.",
            files: compactFiles([...entryFiles, ...componentFiles]),
            id: "final-check",
            objective: "Test the happy path, handle empty and error states, and confirm the finished project works.",
            title: "Validate the finished project",
            voiceoverAngle:
              "Close the tutorial by proving the app works and explaining what viewers can customize next.",
          },
        ],
        title: "Behavior and validation",
      },
    ],
    generatedAt: new Date().toISOString(),
    summary: `A from-scratch teaching path for building the target project using ${stack}.`,
    targetOutcome:
      "A working tutorial project that is built from a clean starting point and explained clearly enough for viewers to follow.",
  };
}

export function createVideoTimeline(project: StoredProject): VideoTimeline {
  if (!project.plan) {
    throw new Error("Generate the build plan first, then create the video timeline.");
  }

  const segments = project.plan.chapters.flatMap((chapter, chapterIndex) =>
    chapter.steps.map((step, stepIndex) => {
      const baseId = `${chapter.id}-${step.id}`;
      const typingMode = chooseCodingMode(step.files);
      const actions = [
        {
          codeAction: `Introduce the goal for "${step.title}" and show the files that will change.`,
          durationSeconds: estimateActionDuration(step.objective, "explain"),
          files: step.files,
          id: `${baseId}-explain`,
          recordingMode: "explain" as const,
          title: "Set up the teaching moment",
          voiceover: buildOpeningVoiceover(step.title, step.objective, step.voiceoverAngle),
        },
        {
          codeAction: buildCodingAction(step.files, typingMode),
          durationSeconds: estimateActionDuration(`${step.objective} ${step.files.join(" ")}`, typingMode),
          files: step.files,
          id: `${baseId}-code`,
          recordingMode: typingMode,
          title: "Build the code",
          voiceover: buildCodingVoiceover(step.files, typingMode),
        },
        {
          codeAction: `Run or inspect the app and confirm: ${step.checkpoint}`,
          durationSeconds: estimateActionDuration(step.checkpoint, "preview"),
          files: step.files,
          id: `${baseId}-preview`,
          recordingMode: "preview" as const,
          title: "Verify the checkpoint",
          voiceover: `Now we pause and check the result. ${step.checkpoint} This gives viewers a clear checkpoint before we move into the next part.`,
        },
      ];
      const durationSeconds = actions.reduce((total, action) => total + action.durationSeconds, 0);

      return {
        actions,
        chapterTitle: chapter.title,
        durationSeconds,
        id: `${chapter.id}-${step.id}`,
        title: `${chapterIndex + 1}.${stepIndex + 1} ${step.title}`,
      };
    }),
  );
  const estimatedDurationSeconds = segments.reduce((total, segment) => total + segment.durationSeconds, 0);
  const voiceoverWordCount = segments.reduce(
    (total, segment) =>
      total + segment.actions.reduce((actionTotal, action) => actionTotal + countWords(action.voiceover), 0),
    0,
  );

  return {
    estimatedDurationSeconds,
    generatedAt: new Date().toISOString(),
    segments,
    voiceoverWordCount,
  };
}

export function createVoiceoverScript(project: StoredProject): VoiceoverScript {
  if (!project.timeline) {
    throw new Error("Generate the video timeline first, then create the voiceover script.");
  }

  const intro = createScriptSection(
    "intro",
    "Intro",
    "In this tutorial, we are going to build a complete project from scratch. We will start with a clean setup, create the structure, explain the important decisions, and finish with a working version viewers can understand and customize.",
  );
  const sections = project.timeline.segments.map((segment, index) => {
    const actionScript = segment.actions
      .map((action) => {
        const files = action.files.length > 0 ? ` In this moment, we are working in ${action.files.join(", ")}.` : "";

        return `${action.voiceover} ${action.codeAction}.${files}`;
      })
      .join(" ");

    return createScriptSection(segment.id, `${index + 1}. ${segment.title}`, smoothScriptText(actionScript));
  });
  const outro = createScriptSection(
    "outro",
    "Outro",
    "And that is the finished project. We built it step by step, so every major decision is clear instead of feeling like code appeared from nowhere. From here, you can customize the styling, add more features, or use this as the foundation for your own version.",
  );
  const allSections = [intro, ...sections, outro];
  const fullScript = allSections.map((section) => `${section.title}\n\n${section.script}`).join("\n\n");
  const wordCount = allSections.reduce((total, section) => total + section.wordCount, 0);

  return {
    estimatedDurationSeconds: estimateNarrationDuration(wordCount),
    fullScript,
    generatedAt: new Date().toISOString(),
    sections: allSections,
    wordCount,
  };
}

export function createTtsPackage(project: StoredProject): TtsPackage {
  if (!project.script) {
    throw new Error("Generate the voiceover script first, then prepare the TTS package.");
  }

  const chunks = project.script.sections.map((section, index) => {
    const chunkNumber = `${index + 1}`.padStart(2, "0");

    return {
      durationSeconds: section.durationSeconds,
      filename: `${chunkNumber}-${slugify(section.title)}.mp3`,
      id: section.id,
      text: normalizeTtsText(section.script),
      title: section.title,
      wordCount: section.wordCount,
    };
  });

  return {
    chunks,
    estimatedDurationSeconds: chunks.reduce((total, chunk) => total + chunk.durationSeconds, 0),
    generatedAt: new Date().toISOString(),
    provider: "elevenlabs",
    voiceMode: "ai-voice",
    wordCount: chunks.reduce((total, chunk) => total + chunk.wordCount, 0),
  };
}

export async function createCodebaseAnalysis(project: StoredProject): Promise<CodebaseAnalysis> {
  const [owner, repo] = project.repoInfo.fullName.split("/");
  const treeData = await fetchGitHubJson(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${project.repoInfo.defaultBranch}?recursive=1`,
  );
  const tree = Array.isArray(treeData.tree) ? (treeData.tree as GitTreeItem[]) : [];
  const files = tree.filter((item) => item.type === "blob");
  const folders = tree.filter((item) => item.type === "tree");
  const paths = files.map((file) => file.path);
  const keyFilePaths = selectKeyFiles(paths);
  const keyFiles = await Promise.all(
    keyFilePaths.map(async (path) => ({
      content: await fetchRawFile(owner, repo, project.repoInfo.defaultBranch, path),
      path,
    })),
  );
  const packageJson = parsePackageJson(keyFiles.find((file) => file.path.endsWith("package.json"))?.content);

  return {
    entryPoints: findEntryPoints(paths),
    fileCount: files.length,
    folderCount: folders.length,
    generatedAt: new Date().toISOString(),
    keyFiles,
    packageManager: detectPackageManager(paths),
    scripts: packageJson?.scripts ?? {},
    stack: detectStack(paths, packageJson),
    tutorialNotes: buildTutorialNotes(paths, packageJson),
  };
}

function compactFiles(files: string[]) {
  const normalized = files
    .map((file) => file.trim())
    .filter(Boolean)
    .map((file) => (file.length > 42 ? `${file.slice(0, 39)}...` : file));

  return Array.from(new Set(normalized)).slice(0, 5);
}

function normalizeTtsText(text: string) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
}

function createScriptSection(id: string, title: string, script: string) {
  const cleanScript = smoothScriptText(script);
  const wordCount = countWords(cleanScript);

  return {
    durationSeconds: estimateNarrationDuration(wordCount),
    id,
    script: cleanScript,
    title,
    wordCount,
  };
}

function smoothScriptText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\.\s+\./g, ".")
    .trim();
}

function estimateNarrationDuration(wordCount: number) {
  return Math.max(8, Math.ceil((wordCount / 145) * 60));
}

function chooseCodingMode(files: string[]): "type" | "paste" {
  const hasManyFiles = files.length > 3;
  const hasConfigFile = files.some((file) => file.includes("package") || file.includes("config") || file.includes("json"));

  return hasManyFiles || hasConfigFile ? "paste" : "type";
}

function buildOpeningVoiceover(title: string, objective: string, angle: string) {
  return `In this section, we are going to ${title.toLowerCase()}. ${objective} ${angle}`;
}

function buildCodingVoiceover(files: string[], mode: "type" | "paste") {
  const fileList = files.length > 0 ? files.join(", ") : "the project files";

  if (mode === "paste") {
    return `This part touches ${fileList}, so we will move a little faster and focus on why the code is structured this way instead of slowly typing every line.`;
  }

  return `Here we will type through ${fileList} step by step, calling out the important decisions as the code appears on screen.`;
}

function buildCodingAction(files: string[], mode: "type" | "paste") {
  const fileList = files.length > 0 ? files.join(", ") : "the target files";

  if (mode === "paste") {
    return `Paste or reveal the larger code block across ${fileList}, then explain the structure and important decisions.`;
  }

  return `Type the implementation into ${fileList}, keeping the pace slow enough for viewers to follow.`;
}

function estimateActionDuration(text: string, mode: "explain" | "paste" | "preview" | "type") {
  const wordCount = countWords(text);
  const baseDuration = Math.ceil((wordCount / 140) * 60);
  const modeExtra = {
    explain: 25,
    paste: 45,
    preview: 30,
    type: 90,
  }[mode];

  return Math.max(25, baseDuration + modeExtra);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function selectKeyFiles(paths: string[]) {
  const priority = [
    "package.json",
    "README.md",
    "app/page.tsx",
    "app/page.jsx",
    "app/layout.tsx",
    "pages/index.tsx",
    "pages/index.jsx",
    "src/App.tsx",
    "src/App.jsx",
    "src/main.tsx",
    "src/main.jsx",
    "index.html",
    "next.config.ts",
    "next.config.js",
    "vite.config.ts",
    "vite.config.js",
    "tailwind.config.ts",
    "tailwind.config.js",
    "tsconfig.json",
  ];

  return priority.filter((path) => paths.includes(path)).slice(0, 8);
}

async function fetchRawFile(owner: string, repo: string, branch: string, path: string) {
  let response: Response;

  try {
    response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`);
  } catch {
    return "Could not load file preview.";
  }

  if (!response.ok) {
    return "Could not load file preview.";
  }

  const text = await response.text();

  return text.length > 12000 ? `${text.slice(0, 12000)}\n...` : text;
}

async function fetchGitHubJson(url: string) {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
  } catch {
    throw new Error("Could not reach GitHub. Check your connection and try again.");
  }

  if (response.status === 403) {
    throw new Error("GitHub rate-limited this browser. Wait a bit, then try again.");
  }

  if (!response.ok) {
    throw new Error("Could not read the project files from GitHub.");
  }

  return response.json();
}

function parsePackageJson(content: string | undefined) {
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };
  } catch {
    return null;
  }
}

function detectPackageManager(paths: string[]) {
  if (paths.includes("pnpm-lock.yaml")) return "pnpm";
  if (paths.includes("yarn.lock")) return "yarn";
  if (paths.includes("bun.lockb") || paths.includes("bun.lock")) return "bun";
  if (paths.includes("package-lock.json")) return "npm";

  return null;
}

function detectStack(paths: string[], packageJson: ReturnType<typeof parsePackageJson>) {
  const packages = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };
  const stack = new Set<string>();

  if (packages.next || paths.some((path) => path.startsWith("app/"))) stack.add("Next.js");
  if (packages.react || paths.some((path) => path.endsWith(".jsx") || path.endsWith(".tsx"))) {
    stack.add("React");
  }
  if (packages.typescript || paths.some((path) => path.endsWith(".ts") || path.endsWith(".tsx"))) {
    stack.add("TypeScript");
  }
  if (packages.tailwindcss || paths.some((path) => path.includes("tailwind"))) {
    stack.add("Tailwind CSS");
  }
  if (packages["framer-motion"] || packages.motion) stack.add("Motion");
  if (packages.gsap) stack.add("GSAP");
  if (packages.vite || paths.some((path) => path.startsWith("vite.config"))) stack.add("Vite");

  return stack.size > 0 ? Array.from(stack) : ["Unknown"];
}

function findEntryPoints(paths: string[]) {
  const candidates = [
    "app/page.tsx",
    "app/page.jsx",
    "app/layout.tsx",
    "pages/index.tsx",
    "pages/index.jsx",
    "src/App.tsx",
    "src/App.jsx",
    "src/main.tsx",
    "src/main.jsx",
    "index.html",
  ];

  return candidates.filter((path) => paths.includes(path)).slice(0, 6);
}

function buildTutorialNotes(paths: string[], packageJson: ReturnType<typeof parsePackageJson>) {
  const scripts = packageJson?.scripts ?? {};
  const notes = ["Start by recreating the project setup, dependencies, folder structure, and run command."];

  if (paths.some((path) => path.startsWith("app/"))) {
    notes.push("Explain the App Router layout first, then build the main route from an empty page.");
  }

  if (paths.some((path) => path.includes("components/"))) {
    notes.push("Introduce reusable components only when the screen needs them, so the tutorial feels natural.");
  }

  if (paths.some((path) => path.includes("globals.css") || path.includes("tailwind"))) {
    notes.push("Set up global styling early before adding detailed UI sections.");
  }

  if (scripts.dev) {
    notes.push(`Use \`${scripts.dev}\` as the local development command while building.`);
  }

  notes.push("Finish with a working checkpoint that proves the project behaves the way the tutorial promised.");

  return notes;
}
