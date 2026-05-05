"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  Captions,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Code2,
  FileArchive,
  Folder,
  Home,
  Library,
  Menu,
  Mic2,
  MonitorPlay,
  PanelLeft,
  Play,
  Plus,
  Radio,
  Settings2,
  Sparkles,
  TerminalSquare,
  Upload,
  Video,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { buildSampleTimeline } from "@/lib/sample-timeline";
import type {
  ExplanationDepth,
  RecordingMode,
  TimelineAction,
  TutorialBrief,
  TutorialStack,
} from "@/lib/tutorial-types";

const stacks: TutorialStack[] = ["React", "Next.js", "HTML/CSS/JS"];
const recordingModes: RecordingMode[] = ["hybrid", "typing", "reveal"];
const explanationDepths: ExplanationDepth[] = ["important", "every-line", "course"];

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Clapperboard, label: "Studio" },
  { icon: Mic2, label: "Voices" },
  { icon: Radio, label: "Flows" },
  { icon: FileArchive, label: "Files" },
];

const pinnedItems = [
  { icon: Video, label: "Repo to Video" },
  { icon: Mic2, label: "Voiceover" },
  { icon: Captions, label: "Captions" },
  { icon: Code2, label: "Code Timeline" },
  { icon: Library, label: "Asset Library" },
];

const toolTiles = [
  { icon: Upload, title: "Upload repo", tint: "bg-[#f06449]" },
  { icon: WandSparkles, title: "Generate plan", tint: "bg-[#7357ff]" },
  { icon: Mic2, title: "Voiceover", tint: "bg-[#2fca86]" },
  { icon: MonitorPlay, title: "Renderer", tint: "bg-[#f59b31]" },
  { icon: Captions, title: "Captions", tint: "bg-[#5477f5]" },
  { icon: Video, title: "Export MP4", tint: "bg-[#111111]" },
];

export function TutorialStudio() {
  const [brief, setBrief] = useState<TutorialBrief>({
    title: "Build an animated SaaS landing page",
    prompt:
      "Create a polished motion-heavy frontend tutorial that starts from a blank project and ends with a clean SaaS hero section.",
    stack: "React",
    recordingMode: "hybrid",
    explanationDepth: "important",
    targetMinutes: 12,
    repoStatus: "confirmed-working",
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeActionIndex, setActiveActionIndex] = useState(0);

  const timeline = useMemo(() => buildSampleTimeline(brief), [brief]);
  const activeStep = timeline.steps[activeStepIndex] ?? timeline.steps[0];
  const activeAction = activeStep.actions[activeActionIndex] ?? activeStep.actions[0];

  function updateBrief<Key extends keyof TutorialBrief>(key: Key, value: TutorialBrief[Key]) {
    setBrief((current) => ({ ...current, [key]: value }));
    setActiveStepIndex(0);
    setActiveActionIndex(0);
  }

  function nextAction() {
    const nextActionIndex = activeActionIndex + 1;
    if (nextActionIndex < activeStep.actions.length) {
      setActiveActionIndex(nextActionIndex);
      return;
    }

    const nextStepIndex = activeStepIndex + 1;
    if (nextStepIndex < timeline.steps.length) {
      setActiveStepIndex(nextStepIndex);
      setActiveActionIndex(0);
    }
  }

  function previousAction() {
    if (activeActionIndex > 0) {
      setActiveActionIndex(activeActionIndex - 1);
      return;
    }

    if (activeStepIndex > 0) {
      const previousStep = timeline.steps[activeStepIndex - 1];
      setActiveStepIndex(activeStepIndex - 1);
      setActiveActionIndex(previousStep.actions.length - 1);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-w-0">
          <Topbar />

          <section className="mx-auto max-w-[1380px] px-6 py-24 lg:px-10">
            <div className="mb-9">
              <Button
                className="mb-10 h-11 rounded-full border bg-background px-3 pr-5 text-sm shadow-none"
                variant="outline"
              >
                <Badge className="rounded-full bg-foreground px-3 text-background">New</Badge>
                Timeline renderer is ready for MVP testing
                <ChevronDown className="-rotate-90" />
              </Button>

              <p className="text-sm font-medium text-muted-foreground">My Workspace</p>
              <h1 className="mt-1 text-4xl font-medium tracking-tight md:text-5xl">
                Good afternoon, Joseph
              </h1>
            </div>

            <ToolTiles />

            <div className="mt-16 grid gap-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)]">
              <div className="grid gap-9">
                <WorkspaceSection title="Create a tutorial video">
                  <BriefForm brief={brief} updateBrief={updateBrief} />
                </WorkspaceSection>

                <WorkspaceSection title="Timeline steps">
                  <StepList
                    activeStepIndex={activeStepIndex}
                    setActiveActionIndex={setActiveActionIndex}
                    setActiveStepIndex={setActiveStepIndex}
                    steps={timeline.steps}
                  />
                </WorkspaceSection>
              </div>

              <div className="grid content-start gap-9">
                <WorkspaceSection title="Timeline preview">
                  <RendererStage action={activeAction} stepTitle={activeStep.title} />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button className="h-11" type="button" variant="outline" onClick={previousAction}>
                      Previous
                    </Button>
                    <Button className="h-11" type="button" onClick={nextAction}>
                      Next action
                    </Button>
                  </div>
                </WorkspaceSection>

                <WorkspaceSection title="Voiceover">
                  <div className="flex gap-4">
                    <IconTile icon={Mic2} tint="bg-[#f06449]" />
                    <div className="min-w-0">
                      <h3 className="font-semibold">{activeStep.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {activeStep.voiceover}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-5" />
                  <div className="flex gap-4">
                    <IconTile icon={Sparkles} tint="bg-[#2fca86]" />
                    <div>
                      <h3 className="font-semibold">Checkpoint</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {activeStep.checkpoint}
                      </p>
                    </div>
                  </div>
                </WorkspaceSection>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="hidden min-h-screen border-r bg-[#f8f8f8] px-3 py-5 lg:flex lg:flex-col">
      <div className="px-3 pb-6 text-2xl font-black tracking-tight">RepoVid</div>

      <Button className="mb-4 h-11 justify-between rounded-xl bg-background shadow-sm" variant="outline">
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-[#fff4ef] text-sm">●</span>
          <span className="truncate font-medium">JosephCreative</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <nav className="grid gap-1">
        {navItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="mt-7 px-2 text-sm font-medium text-muted-foreground">Pinned</div>
      <nav className="mt-3 grid gap-1">
        {pinnedItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="mt-auto grid gap-3">
        <Card className="bg-background shadow-sm" size="sm">
          <CardHeader>
            <div className="mb-2 grid size-9 place-items-center rounded-full bg-muted">
              <Sparkles className="size-4" />
            </div>
            <CardTitle>Invite collaborators</CardTitle>
            <CardDescription>
              Bring editors or voice actors into a tutorial project.
            </CardDescription>
          </CardHeader>
        </Card>
        <Button className="h-10 justify-start rounded-xl" variant="outline">
          <Settings2 />
          Developers
        </Button>
        <Button className="h-10 rounded-xl bg-[repeating-linear-gradient(-45deg,#ffffff_0,#ffffff_7px,#f3f3f3_7px,#f3f3f3_14px)] text-foreground shadow-none hover:bg-muted">
          <Zap className="rounded-full bg-foreground p-1 text-background" />
          Upgrade
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({
  active,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: typeof Home;
  label: string;
}) {
  return (
    <Button
      className={`h-10 justify-start rounded-xl px-3 text-[15px] ${
        active ? "bg-muted text-foreground" : "text-muted-foreground"
      }`}
      variant="ghost"
    >
      <Icon className="size-5" />
      {label}
      {label === "Voices" ? <Plus className="ml-auto size-4" /> : null}
    </Button>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-5">
        <Button className="size-8" size="icon" variant="ghost">
          <PanelLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-3 font-medium">
          <Menu className="size-4 text-muted-foreground" />
          Home
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline">Feedback</Button>
        <Button variant="outline">Docs</Button>
        <Button variant="outline">
          <CircleHelp />
          Ask
        </Button>
        <Button size="icon" variant="outline">
          <Folder />
        </Button>
        <Button size="icon" variant="outline">
          <Bell />
        </Button>
        <Button className="size-9 rounded-full" size="icon" variant="outline">
          J
        </Button>
      </div>
    </header>
  );
}

function ToolTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {toolTiles.map((tile) => (
        <button className="group grid gap-3 text-center" key={tile.title} type="button">
          <div className="grid aspect-square place-items-center rounded-2xl bg-[#f4f4f4] transition group-hover:bg-[#eeeeee]">
            <div className="relative grid size-24 place-items-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-background shadow-sm">
                <tile.icon className="size-8 text-muted-foreground" />
              </div>
              <span
                className={`absolute right-1 bottom-2 grid size-9 place-items-center rounded-full text-white ${tile.tint}`}
              >
                <Play className="size-4 fill-current" />
              </span>
            </div>
          </div>
          <span className="font-medium">{tile.title}</span>
        </button>
      ))}
    </div>
  );
}

function WorkspaceSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function BriefForm({
  brief,
  updateBrief,
}: {
  brief: TutorialBrief;
  updateBrief: <Key extends keyof TutorialBrief>(key: Key, value: TutorialBrief[Key]) => void;
}) {
  return (
    <Card className="bg-background shadow-none">
      <CardContent className="grid gap-5 pt-1">
        <div className="grid gap-2">
          <Label>Tutorial title</Label>
          <Input
            className="h-11"
            value={brief.title}
            onChange={(event) => updateBrief("title", event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Prompt</Label>
          <Textarea
            className="min-h-28 resize-y"
            value={brief.prompt}
            onChange={(event) => updateBrief("prompt", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Stack"
            options={stacks}
            value={brief.stack}
            onChange={(value) => updateBrief("stack", value as TutorialStack)}
          />
          <SelectField
            label="Recording"
            options={recordingModes}
            value={brief.recordingMode}
            onChange={(value) => updateBrief("recordingMode", value as RecordingMode)}
          />
          <SelectField
            label="Explanation"
            options={explanationDepths}
            value={brief.explanationDepth}
            onChange={(value) => updateBrief("explanationDepth", value as ExplanationDepth)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Target minutes</Label>
          <Input
            className="h-11 max-w-40"
            max={60}
            min={5}
            type="number"
            value={brief.targetMinutes}
            onChange={(event) => updateBrief("targetMinutes", Number(event.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option.replace("-", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StepList({
  activeStepIndex,
  setActiveActionIndex,
  setActiveStepIndex,
  steps,
}: {
  activeStepIndex: number;
  setActiveActionIndex: (index: number) => void;
  setActiveStepIndex: (index: number) => void;
  steps: ReturnType<typeof buildSampleTimeline>["steps"];
}) {
  return (
    <div className="grid gap-3">
      {steps.map((step, index) => (
        <button
          className="flex gap-4 rounded-xl p-2 text-left transition hover:bg-muted"
          key={step.id}
          type="button"
          onClick={() => {
            setActiveStepIndex(index);
            setActiveActionIndex(0);
          }}
        >
          <span
            className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
              activeStepIndex === index ? "bg-foreground text-background" : "bg-muted text-foreground"
            }`}
          >
            {index + 1}
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">{step.title}</span>
            <span className="mt-1 block truncate text-sm text-muted-foreground">
              {step.objective}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function IconTile({ icon: Icon, tint }: { icon: typeof Mic2; tint: string }) {
  return (
    <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-muted">
      <span className={`grid size-9 place-items-center rounded-xl text-white ${tint}`}>
        <Icon className="size-5" />
      </span>
    </div>
  );
}

function RendererStage({ action, stepTitle }: { action: TimelineAction; stepTitle: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <MonitorPlay className="size-4" />
            Renderer stage
          </div>
          <div className="truncate text-sm font-semibold">{stepTitle}</div>
        </div>
        <Badge variant="secondary">{action.durationSeconds}s</Badge>
      </div>

      <div className="grid min-h-[480px] grid-rows-[1fr_96px]">
        <div className="grid min-h-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
          <CodeOrTerminal action={action} />
          <BrowserPreview action={action} />
        </div>
        <div className="border-t bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <TerminalSquare className="size-4" />
            Action
          </div>
          <p className="truncate text-sm font-medium">{action.label}</p>
        </div>
      </div>
    </div>
  );
}

function CodeOrTerminal({ action }: { action: TimelineAction }) {
  const isTerminal = action.type === "terminal";
  const content = isTerminal ? action.command : action.type === "code" ? action.code : "// Browser preview";
  const label = isTerminal ? "Terminal" : action.type === "code" ? action.file : "Preview";

  return (
    <div className="min-w-0 border-b bg-[#141414] xl:border-r xl:border-b-0">
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-3">
        <span className="text-xs font-semibold text-white/60">{label}</span>
        <span className="text-xs font-medium text-white/35">{isTerminal ? "shell" : "code"}</span>
      </div>
      <pre className="h-[300px] overflow-auto p-4 text-sm leading-6 text-white/85 xl:h-[384px]">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function BrowserPreview({ action }: { action: TimelineAction }) {
  const title = action.type === "preview" ? action.previewTitle : "Live browser preview";
  const body =
    action.type === "preview"
      ? action.previewBody
      : "The renderer switches here after meaningful code changes.";

  return (
    <div className="min-w-0 bg-[#f4f4f4]">
      <div className="flex h-10 items-center gap-2 border-b bg-background px-3">
        <span className="size-2.5 rounded-full bg-[#ff6b57]" />
        <span className="size-2.5 rounded-full bg-[#f5c04e]" />
        <span className="size-2.5 rounded-full bg-[#40c77b]" />
        <span className="ml-2 truncate rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          localhost:3000
        </span>
      </div>
      <div className="grid h-[300px] place-items-center p-7 xl:h-[384px]">
        <div className="max-w-sm">
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">
            Preview moment
          </p>
          <h2 className="text-4xl leading-none font-medium tracking-tight">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}
