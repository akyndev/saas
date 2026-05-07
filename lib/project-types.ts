export type RepoRootItem = {
  name: string;
  path: string;
  size: number | null;
  type: "dir" | "file" | string;
};

export type RepoInfo = {
  defaultBranch: string;
  description: string | null;
  fullName: string;
  htmlUrl: string;
};

export type CodeSample = {
  content: string;
  path: string;
};

export type CodebaseAnalysis = {
  entryPoints: string[];
  fileCount: number;
  folderCount: number;
  generatedAt: string;
  keyFiles: CodeSample[];
  packageManager: string | null;
  scripts: Record<string, string>;
  stack: string[];
  tutorialNotes: string[];
};

export type RebuildPlanStep = {
  checkpoint: string;
  files: string[];
  id: string;
  objective: string;
  title: string;
  voiceoverAngle: string;
};

export type RebuildPlanChapter = {
  id: string;
  objective: string;
  steps: RebuildPlanStep[];
  title: string;
};

export type RebuildPlan = {
  chapters: RebuildPlanChapter[];
  generatedAt: string;
  summary: string;
  targetOutcome: string;
};

export type TimelineAction = {
  codeAction: string;
  durationSeconds: number;
  files: string[];
  id: string;
  recordingMode: "type" | "paste" | "explain" | "preview";
  title: string;
  voiceover: string;
};

export type VideoTimelineSegment = {
  actions: TimelineAction[];
  chapterTitle: string;
  durationSeconds: number;
  id: string;
  title: string;
};

export type VideoTimeline = {
  estimatedDurationSeconds: number;
  generatedAt: string;
  segments: VideoTimelineSegment[];
  voiceoverWordCount: number;
};

export type VoiceoverScriptSection = {
  durationSeconds: number;
  id: string;
  script: string;
  title: string;
  wordCount: number;
};

export type VoiceoverScript = {
  estimatedDurationSeconds: number;
  fullScript: string;
  generatedAt: string;
  sections: VoiceoverScriptSection[];
  wordCount: number;
};

export type TtsChunk = {
  durationSeconds: number;
  filename: string;
  id: string;
  text: string;
  title: string;
  wordCount: number;
};

export type TtsPackage = {
  chunks: TtsChunk[];
  estimatedDurationSeconds: number;
  generatedAt: string;
  provider: "elevenlabs";
  voiceMode: "ai-voice" | "cloned-voice";
  wordCount: number;
};

export type StoredProject = {
  analysis?: CodebaseAnalysis;
  createdAt: string;
  id: string;
  plan?: RebuildPlan;
  repoInfo: RepoInfo;
  repoUrl: string;
  rootItems: RepoRootItem[];
  script?: VoiceoverScript;
  status: "overview" | "analyzed" | "planned" | "timelined" | "scripted" | "tts-ready";
  timeline?: VideoTimeline;
  totalSize: number;
  ttsPackage?: TtsPackage;
};

export const projectStoragePrefix = "tutoriallab.project.";
export const legacyProjectStoragePrefix = "repovid.project.";
export const projectStoragePrefixes = [projectStoragePrefix, legacyProjectStoragePrefix];

export function projectStorageKey(projectId: string) {
  return `${projectStoragePrefix}${projectId}`;
}

export function legacyProjectStorageKey(projectId: string) {
  return `${legacyProjectStoragePrefix}${projectId}`;
}
