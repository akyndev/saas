export type TutorialStack = "React" | "Next.js" | "HTML/CSS/JS";

export type RecordingMode = "hybrid" | "typing" | "reveal";

export type ExplanationDepth = "important" | "every-line" | "course";

export type TutorialBrief = {
  title: string;
  repoName: string;
  prompt: string;
  stack: TutorialStack;
  recordingMode: RecordingMode;
  explanationDepth: ExplanationDepth;
  targetMinutes: number;
  repoStatus: "confirmed-working" | "needs-verification";
};

export type TimelineAction =
  | {
      type: "terminal";
      label: string;
      command: string;
      durationSeconds: number;
    }
  | {
      type: "code";
      label: string;
      file: string;
      code: string;
      durationSeconds: number;
    }
  | {
      type: "preview";
      label: string;
      previewTitle: string;
      previewBody: string;
      durationSeconds: number;
    };

export type TutorialStep = {
  id: string;
  title: string;
  objective: string;
  voiceover: string;
  checkpoint: string;
  actions: TimelineAction[];
};

export type TutorialTimeline = {
  title: string;
  stack: TutorialStack;
  recordingMode: RecordingMode;
  explanationDepth: ExplanationDepth;
  estimatedMinutes: number;
  summary: string;
  steps: TutorialStep[];
};
