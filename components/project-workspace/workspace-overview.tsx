"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileArchive,
  Folder,
  GitBranch,
  Loader2,
  MonitorPlay,
  Route,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AnalysisPanel,
  MetricCard,
  RebuildPlanPanel,
  TtsPackagePanel,
  VideoTimelinePanel,
  VoiceoverScriptPanel,
} from "@/components/project-workspace/panels";
import {
  createCodebaseAnalysis,
  createRebuildPlan,
  createTtsPackage,
  createVideoTimeline,
  createVoiceoverScript,
} from "@/lib/project-generators";
import { saveStoredProject } from "@/lib/project-storage";
import type { StoredProject } from "@/lib/project-types";
import { formatBytes } from "@/components/tutorial-studio";

const stages = [
  {
    description: "Repo metadata and root structure are ready.",
    label: "Repo overview",
    state: "Ready",
  },
  {
    description: "Map the source project before the AI plans the tutorial.",
    label: "AI understanding",
    state: "Next",
  },
  {
    description: "Then it plans how to build the tutorial project from scratch.",
    label: "Build plan",
    state: "Later",
  },
  {
    description: "Finally we turn the plan into code steps and voiceover.",
    label: "Video timeline",
    state: "Later",
  },
  {
    description: "Create the narration script that can be sent to TTS.",
    label: "Voiceover script",
    state: "Later",
  },
  {
    description: "Split narration into clean chunks for audio generation.",
    label: "TTS package",
    state: "Later",
  },
];

type ProjectAction = "analysis" | "plan" | "script" | "timeline" | "tts";

export function WorkspaceOverview({ project }: { project: StoredProject }) {
  const [pendingAction, setPendingAction] = useState<ProjectAction | null>(null);
  const [errors, setErrors] = useState({
    analysis: "",
    plan: "",
    script: "",
    timeline: "",
    tts: "",
  });
  const createdAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(project.createdAt));

  async function analyzeCodebase() {
    clearErrors("analysis", "plan");
    setPendingAction("analysis");

    try {
      const analysis = await createCodebaseAnalysis(project);
      saveStoredProject({
        ...project,
        analysis,
        status: "analyzed",
      });
    } catch (caughtError) {
      setActionError("analysis", caughtError, "Could not understand this repo yet.");
    } finally {
      setPendingAction(null);
    }
  }

  function generateRebuildPlan() {
    clearErrors("plan", "timeline");

    if (!project.analysis) {
      setErrors((current) => ({
        ...current,
        plan: "Understand the codebase first, then generate the build plan.",
      }));
      return;
    }

    runProjectUpdate("plan", () => ({
      ...project,
      plan: createRebuildPlan(project),
      status: "planned",
    }));
  }

  function generateVideoTimeline() {
    clearErrors("timeline", "script");

    if (!project.plan) {
      setErrors((current) => ({
        ...current,
        timeline: "Generate the build plan first, then create the video timeline.",
      }));
      return;
    }

    runProjectUpdate("timeline", () => ({
      ...project,
      status: "timelined",
      timeline: createVideoTimeline(project),
    }));
  }

  function generateVoiceoverScript() {
    clearErrors("script", "tts");

    if (!project.timeline) {
      setErrors((current) => ({
        ...current,
        script: "Generate the video timeline first, then create the voiceover script.",
      }));
      return;
    }

    runProjectUpdate("script", () => ({
      ...project,
      script: createVoiceoverScript(project),
      status: "scripted",
    }));
  }

  function prepareTtsPackage() {
    clearErrors("tts");

    if (!project.script) {
      setErrors((current) => ({
        ...current,
        tts: "Generate the voiceover script first, then prepare the TTS package.",
      }));
      return;
    }

    runProjectUpdate("tts", () => ({
      ...project,
      status: "tts-ready",
      ttsPackage: createTtsPackage(project),
    }));
  }

  function clearErrors(...keys: Array<keyof typeof errors>) {
    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(keys.map((key) => [key, ""])),
    }));
  }

  function runProjectUpdate(action: Exclude<ProjectAction, "analysis">, updateProject: () => StoredProject) {
    setPendingAction(action);

    try {
      saveStoredProject(updateProject());
    } catch (caughtError) {
      const fallbacks = {
        plan: "Could not create the build plan yet.",
        script: "Could not create the voiceover script yet.",
        timeline: "Could not create the video timeline yet.",
        tts: "Could not prepare the TTS package yet.",
      };
      setActionError(action, caughtError, fallbacks[action]);
    } finally {
      setPendingAction(null);
    }
  }

  function setActionError(key: keyof typeof errors, caughtError: unknown, fallback: string) {
    setErrors((current) => ({
      ...current,
      [key]: caughtError instanceof Error ? caughtError.message : fallback,
    }));
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button asChild className="mb-8" variant="outline">
            <Link href="/">
              <ArrowLeft />
              New repo
            </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground">Project workspace</p>
          <h1 className="mt-1 text-4xl font-medium tracking-tight md:text-5xl">{project.repoInfo.fullName}</h1>
          {project.repoInfo.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{project.repoInfo.description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={pendingAction === "analysis"} onClick={analyzeCodebase}>
            {pendingAction === "analysis" ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {project.analysis ? "Refresh understanding" : "Understand codebase"}
          </Button>
          <Button
            disabled={!project.analysis || pendingAction === "plan"}
            onClick={generateRebuildPlan}
            variant={project.plan ? "outline" : "default"}
          >
            {pendingAction === "plan" ? <Loader2 className="animate-spin" /> : <Route />}
            {project.plan ? "Refresh build plan" : "Generate build plan"}
          </Button>
          <Button
            disabled={!project.plan || pendingAction === "timeline"}
            onClick={generateVideoTimeline}
            variant={project.timeline ? "outline" : "default"}
          >
            {pendingAction === "timeline" ? <Loader2 className="animate-spin" /> : <MonitorPlay />}
            {project.timeline ? "Refresh timeline" : "Generate timeline"}
          </Button>
          <Button
            disabled={!project.timeline || pendingAction === "script"}
            onClick={generateVoiceoverScript}
            variant={project.script ? "outline" : "default"}
          >
            {pendingAction === "script" ? <Loader2 className="animate-spin" /> : <Volume2 />}
            {project.script ? "Refresh script" : "Generate script"}
          </Button>
          <Button
            disabled={!project.script || pendingAction === "tts"}
            onClick={prepareTtsPackage}
            variant={project.ttsPackage ? "outline" : "default"}
          >
            {pendingAction === "tts" ? <Loader2 className="animate-spin" /> : <SlidersHorizontal />}
            {project.ttsPackage ? "Refresh TTS package" : "Prepare TTS package"}
          </Button>
          <Button asChild variant="outline">
            <a href={project.repoInfo.htmlUrl} rel="noreferrer" target="_blank">
              Open repo
              <ExternalLink />
            </a>
          </Button>
        </div>
      </div>

      {Object.values(errors).map((error) =>
        error ? (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" key={error}>
            {error}
          </div>
        ) : null,
      )}

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <MetricCard icon={GitBranch} label="Default branch" value={project.repoInfo.defaultBranch} />
        <MetricCard icon={FileArchive} label="Estimated size" value={formatBytes(project.totalSize)} />
        <MetricCard icon={Calendar} label="Created" value={createdAt} />
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-6">
        {stages.map((stage, index) => (
          <Card key={stage.label} size="sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{stage.label}</CardTitle>
                <Badge variant={isStageReady(index, project) ? "secondary" : "outline"}>
                  {isStageReady(index, project) ? "Ready" : stage.state}
                </Badge>
              </div>
              <CardDescription>{stage.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {project.ttsPackage ? <TtsPackagePanel ttsPackage={project.ttsPackage} /> : null}
      {project.script ? <VoiceoverScriptPanel script={project.script} /> : null}
      {project.timeline ? <VideoTimelinePanel timeline={project.timeline} /> : null}
      {project.plan ? <RebuildPlanPanel plan={project.plan} /> : null}
      {project.analysis ? <AnalysisPanel analysis={project.analysis} /> : null}

      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3 text-sm font-semibold">
          <span>Root structure</span>
          <span className="text-muted-foreground">{formatBytes(project.totalSize)}</span>
        </div>
        <div className="divide-y">
          {project.rootItems.map((item) => (
            <div className="flex items-center gap-3 px-4 py-3" key={item.path}>
              <div className="grid size-8 place-items-center rounded-lg bg-muted">
                {item.type === "dir" ? (
                  <Folder className="size-4 text-muted-foreground" />
                ) : (
                  <FileArchive className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</div>
              <span className="text-xs text-muted-foreground">{item.size === null ? "-" : formatBytes(item.size)}</span>
              <Badge variant="outline">{item.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function isStageReady(index: number, project: StoredProject) {
  return (
    index === 0 ||
    (index === 1 && Boolean(project.analysis)) ||
    (index === 2 && Boolean(project.plan)) ||
    (index === 3 && Boolean(project.timeline)) ||
    (index === 4 && Boolean(project.script)) ||
    (index === 5 && Boolean(project.ttsPackage))
  );
}
