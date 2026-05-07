"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Copy,
  FileArchive,
  Folder,
  Keyboard,
  MonitorPlay,
  Package,
  Play,
  SlidersHorizontal,
  TimerReset,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/components/project-workspace/format";
import type {
  CodebaseAnalysis,
  RebuildPlan,
  TtsPackage,
  VideoTimeline,
  VoiceoverScript,
} from "@/lib/project-types";

export function RebuildPlanPanel({ plan }: { plan: RebuildPlan }) {
  const stepCount = plan.chapters.reduce((total, chapter) => total + chapter.steps.length, 0);

  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">From-scratch build plan</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{plan.summary}</p>
        </div>
        <Badge variant="secondary">{stepCount} tutorial steps</Badge>
      </div>

      <Card className="mb-3" size="sm">
        <CardHeader>
          <CardTitle>Target outcome</CardTitle>
          <CardDescription>{plan.targetOutcome}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        {plan.chapters.map((chapter, chapterIndex) => (
          <Card key={chapter.id} size="sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {chapterIndex + 1}
                </span>
                <div className="min-w-0">
                  <CardTitle>{chapter.title}</CardTitle>
                  <CardDescription>{chapter.objective}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {chapter.steps.map((step) => (
                <div className="grid gap-3 rounded-xl border bg-background p-4" key={step.id}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.objective}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Files</p>
                      <div className="flex flex-wrap gap-2">
                        {step.files.map((file) => (
                          <Badge key={file} variant="outline">
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Voiceover angle</p>
                      <p className="text-sm leading-6 text-muted-foreground">{step.voiceoverAngle}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Checkpoint: </span>
                    {step.checkpoint}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function VideoTimelinePanel({ timeline }: { timeline: VideoTimeline }) {
  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Video production timeline</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A structured recording plan with coding actions, voiceover beats, and timing estimates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{formatDuration(timeline.estimatedDurationSeconds)}</Badge>
          <Badge variant="outline">{timeline.voiceoverWordCount} voiceover words</Badge>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard icon={MonitorPlay} label="Segments" value={`${timeline.segments.length}`} />
        <MetricCard icon={Clock} label="Estimated length" value={formatDuration(timeline.estimatedDurationSeconds)} />
        <MetricCard icon={Keyboard} label="Actions" value={`${countTimelineActions(timeline)}`} />
      </div>

      <div className="mt-3 grid gap-3">
        {timeline.segments.map((segment, segmentIndex) => (
          <Card key={segment.id} size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                    {segmentIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <CardTitle>{segment.title}</CardTitle>
                    <CardDescription>{segment.chapterTitle}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{formatDuration(segment.durationSeconds)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {segment.actions.map((action) => (
                <div className="grid gap-3 rounded-xl border bg-background p-4" key={action.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{action.title}</h3>
                        <Badge variant="secondary">{action.recordingMode}</Badge>
                        <Badge variant="outline">{formatDuration(action.durationSeconds)}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.codeAction}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Files touched</p>
                    <div className="flex flex-wrap gap-2">
                      {action.files.map((file) => (
                        <Badge key={file} variant="outline">
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                      <TimerReset className="size-3" />
                      Voiceover
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{action.voiceover}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function VoiceoverScriptPanel({ script }: { script: VoiceoverScript }) {
  const [copyLabel, setCopyLabel] = useState("Copy full script");

  async function copyScript() {
    await navigator.clipboard.writeText(script.fullScript);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy full script"), 1600);
  }

  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Voiceover script</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A narration-ready script assembled from the production timeline, with timing and section boundaries for TTS.
          </p>
        </div>
        <Button onClick={copyScript} variant="outline">
          <Copy />
          {copyLabel}
        </Button>
      </div>

      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <MetricCard icon={Volume2} label="Words" value={`${script.wordCount}`} />
        <MetricCard icon={Clock} label="Narration time" value={formatDuration(script.estimatedDurationSeconds)} />
        <MetricCard icon={FileArchive} label="Sections" value={`${script.sections.length}`} />
      </div>

      <Card className="mb-3" size="sm">
        <CardHeader>
          <CardTitle>Full script</CardTitle>
          <CardDescription>Copy this into a TTS provider or use it as the base for voice cloning.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-[#151515] p-4 text-sm leading-6 text-white/85">
            {script.fullScript}
          </pre>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {script.sections.map((section, index) => (
          <Card key={section.id} size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle>
                    {index + 1}. {section.title}
                  </CardTitle>
                  <CardDescription>
                    {section.wordCount} words {" · "}
                    {formatDuration(section.durationSeconds)}
                  </CardDescription>
                </div>
                <Badge variant="outline">TTS chunk</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{section.script}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function TtsPackagePanel({ ttsPackage }: { ttsPackage: TtsPackage }) {
  const [copyLabel, setCopyLabel] = useState("Copy package JSON");
  const packageJson = JSON.stringify(ttsPackage, null, 2);

  async function copyPackage() {
    await navigator.clipboard.writeText(packageJson);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy package JSON"), 1600);
  }

  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">TTS package</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Narration chunks prepared for audio generation. Each chunk has a stable filename, clean text, and an
            estimated duration.
          </p>
        </div>
        <Button onClick={copyPackage} variant="outline">
          <Copy />
          {copyLabel}
        </Button>
      </div>

      <div className="mb-3 grid gap-3 md:grid-cols-4">
        <MetricCard icon={SlidersHorizontal} label="Provider" value={ttsPackage.provider} />
        <MetricCard icon={Volume2} label="Voice mode" value={ttsPackage.voiceMode.replace("-", " ")} />
        <MetricCard icon={Clock} label="Estimated audio" value={formatDuration(ttsPackage.estimatedDurationSeconds)} />
        <MetricCard icon={FileArchive} label="Chunks" value={`${ttsPackage.chunks.length}`} />
      </div>

      <div className="grid gap-3">
        {ttsPackage.chunks.map((chunk, index) => (
          <Card key={chunk.id} size="sm">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle>
                    {index + 1}. {chunk.title}
                  </CardTitle>
                  <CardDescription>{chunk.filename}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{chunk.wordCount} words</Badge>
                  <Badge variant="outline">{formatDuration(chunk.durationSeconds)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{chunk.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AnalysisPanel({ analysis }: { analysis: CodebaseAnalysis }) {
  return (
    <div className="mb-8 grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.75fr)]">
      <section>
        <h2 className="mb-5 text-2xl font-semibold tracking-tight">Codebase understanding</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard icon={FileArchive} label="Files scanned" value={`${analysis.fileCount}`} />
          <MetricCard icon={Folder} label="Folders found" value={`${analysis.folderCount}`} />
          <MetricCard icon={Package} label="Package manager" value={analysis.packageManager ?? "Unknown"} />
        </div>

        <Card className="mt-3" size="sm">
          <CardHeader>
            <CardTitle>Detected stack</CardTitle>
            <CardDescription>
              This is the first pass the future AI planner will use before making a from-scratch tutorial path.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.stack.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-3" size="sm">
          <CardHeader>
            <CardTitle>Likely tutorial route</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {analysis.tutorialNotes.map((note, index) => (
              <div className="flex gap-3 rounded-lg bg-muted/40 p-3" key={note}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-background text-xs font-semibold">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-muted-foreground">{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold tracking-tight">Key files</h2>
        <div className="grid gap-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Entry points</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {analysis.entryPoints.map((path) => (
                <div className="flex items-center gap-2 text-sm" key={path}>
                  <Play className="size-3 text-muted-foreground" />
                  <span className="truncate">{path}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {Object.keys(analysis.scripts).length > 0 ? (
            <Card size="sm">
              <CardHeader>
                <CardTitle>Scripts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {Object.entries(analysis.scripts).map(([name, command]) => (
                  <div className="grid gap-1 rounded-lg bg-muted/40 p-3" key={name}>
                    <span className="text-sm font-semibold">{name}</span>
                    <code className="truncate text-xs text-muted-foreground">{command}</code>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {analysis.keyFiles.map((file) => (
            <Card key={file.path} size="sm">
              <CardHeader>
                <CardTitle>{file.path}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="max-h-52 overflow-auto rounded-lg bg-[#151515] p-3 text-xs leading-5 text-white/85">
                  <code>{file.content}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="truncate text-sm font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function countTimelineActions(timeline: VideoTimeline) {
  return timeline.segments.reduce((total, segment) => total + segment.actions.length, 0);
}
