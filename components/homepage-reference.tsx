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
  FlaskConical,
  Folder,
  Home,
  Library,
  Menu,
  Mic2,
  MonitorPlay,
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
  { icon: Video, label: "Tutorial Video" },
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

const sidebarRow =
  "w-[calc(var(--sidebar-width)-1.5625rem)] rounded-[10px] px-2";
const sidebarLabel =
  "flex h-8 flex-1 translate-x-0 items-center justify-between opacity-100 transition-all duration-150 group-data-[collapsible=icon]:translate-x-1 group-data-[collapsible=icon]:opacity-0";

type ProjectRecord = {
  id: string;
  title: string;
  repoName: string;
  stack: TutorialStack;
  steps: number;
};

export function TutorialStudio() {
  const initialBrief: TutorialBrief = {
    title: "Build an animated SaaS landing page",
    repoName: "motion-saas-landing",
    prompt:
      "Create a polished motion-heavy frontend tutorial that starts from a blank project and ends with a clean SaaS hero section.",
    stack: "React",
    recordingMode: "hybrid",
    explanationDepth: "important",
    targetMinutes: 12,
    repoStatus: "confirmed-working",
  };
  const [draftBrief, setDraftBrief] = useState<TutorialBrief>(initialBrief);
  const [activeBrief, setActiveBrief] = useState<TutorialBrief>(initialBrief);
  const [recentProjects, setRecentProjects] = useState<ProjectRecord[]>([
    {
      id: "sample-project",
      title: initialBrief.title,
      repoName: initialBrief.repoName,
      stack: initialBrief.stack,
      steps: buildSampleTimeline(initialBrief).steps.length,
    },
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeActionIndex, setActiveActionIndex] = useState(0);

  const timeline = useMemo(() => buildSampleTimeline(activeBrief), [activeBrief]);
  const activeStep = timeline.steps[activeStepIndex] ?? timeline.steps[0];
  const activeAction = activeStep.actions[activeActionIndex] ?? activeStep.actions[0];

  function updateBrief<Key extends keyof TutorialBrief>(key: Key, value: TutorialBrief[Key]) {
    setDraftBrief((current) => ({ ...current, [key]: value }));
  }

  function generateTimeline() {
    const nextBrief = {
      ...draftBrief,
      title: draftBrief.title.trim() || "Untitled tutorial video",
      repoName: draftBrief.repoName.trim() || "local-repo",
      prompt: draftBrief.prompt.trim() || "Create a clean coding tutorial from this repo.",
    };
    const nextTimeline = buildSampleTimeline(nextBrief);

    setActiveBrief(nextBrief);
    setRecentProjects((projects) => [
      {
        id: `${Date.now()}`,
        title: nextBrief.title,
        repoName: nextBrief.repoName,
        stack: nextBrief.stack,
        steps: nextTimeline.steps.length,
      },
      ...projects.filter((project) => project.title !== nextBrief.title).slice(0, 4),
    ]);
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13.25rem",
          "--sidebar-width-icon": "4.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset>
        <div className="min-w-0 bg-background text-foreground">
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
                  <BriefForm
                    brief={draftBrief}
                    onGenerate={generateTimeline}
                    updateBrief={updateBrief}
                  />
                </WorkspaceSection>

                <WorkspaceSection title="Recent projects">
                  <RecentProjects projects={recentProjects} />
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
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <Sidebar className="overflow-hidden border-r bg-[#f8f8f8]" collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex h-9 items-center gap-2 px-2 pb-4 text-[21px] font-black leading-none tracking-tight">
          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-foreground text-background">
            <FlaskConical className="size-4" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">TutorialLab</span>
        </div>
{/* 
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={`${sidebarRow} h-10 border bg-background shadow-sm`}
              size="lg"
              tooltip="TutorialLab Creative"
            >
              <span className="grid h-8 w-5 shrink-0 place-items-center">
                <span className="grid size-5 place-items-center rounded-md border bg-[#fff4ef] text-[11px]">
                  ●
                </span>
              </span>
              <span className={sidebarLabel}>
                <span className="max-w-[168px] truncate text-sm font-medium">TutorialLab Creative</span>
                <ChevronDown className="mr-0.5 size-4 text-muted-foreground" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <AppSidebarItem key={item.label} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-5">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-0">
            Pinned
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pinnedItems.map((item) => (
                <AppSidebarItem key={item.label} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 p-3">
        {/* <Card
          className="bg-background shadow-sm transition-[opacity,transform] duration-200 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-y-1 group-data-[collapsible=icon]:overflow-hidden"
          size="sm"
        >
          <CardHeader>
            <div className="mb-2 grid size-9 place-items-center rounded-full bg-muted">
              <Sparkles className="size-4" />
            </div>
            <CardTitle>Invite collaborators</CardTitle>
            <CardDescription>
              Bring editors or voice actors into a tutorial project.
            </CardDescription>
          </CardHeader>
        </Card> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={`${sidebarRow} h-9`}
              tooltip="Developers"
            >
              <span className="grid h-8 w-5 shrink-0 place-items-center">
                <Settings2 className="size-5" />
              </span>
              <span className={sidebarLabel}>
                <span className="truncate text-sm font-medium">Developers</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={`${sidebarRow} h-9 bg-[repeating-linear-gradient(-45deg,#ffffff_0,#ffffff_7px,#f3f3f3_7px,#f3f3f3_14px)]`}
              tooltip="Upgrade"
            >
              <span className="grid h-8 w-5 shrink-0 place-items-center">
                <Zap className="size-5 rounded-full bg-foreground p-1 text-background" />
              </span>
              <span className={sidebarLabel}>
                <span className="truncate text-sm font-medium">Upgrade</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AppSidebarItem({
  active,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: typeof Home;
  label: string;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={`${sidebarRow} h-9 text-[15px] font-medium`}
        isActive={active}
        tooltip={label}
      >
        <span className="grid h-8 w-5 shrink-0 place-items-center">
          <Icon className="size-5" />
        </span>
        <span className={sidebarLabel}>
          <span className="max-w-[168px] truncate text-sm font-medium">{label}</span>
        </span>
        {label === "Voices" ? (
          <Plus className="absolute top-[0.45rem] right-2 size-4 opacity-60 transition-opacity group-data-[collapsible=icon]:opacity-0" />
        ) : null}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-5">
        <SidebarTrigger className="size-8" />
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
  onGenerate,
  updateBrief,
}: {
  brief: TutorialBrief;
  onGenerate: () => void;
  updateBrief: <Key extends keyof TutorialBrief>(key: Key, value: TutorialBrief[Key]) => void;
}) {
  return (
    <Card className="bg-background shadow-none">
      <CardContent className="grid gap-5 pt-1">
        <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-background shadow-sm">
              <Upload className="size-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Source repo</h3>
              <p className="text-xs text-muted-foreground">
                Mocked for now. AI repo reading comes after this flow.
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Repo or project name</Label>
            <Input
              className="h-11"
              value={brief.repoName}
              onChange={(event) => updateBrief("repoName", event.target.value)}
            />
          </div>
        </div>

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

        <Button className="h-11 w-fit px-5" type="button" onClick={onGenerate}>
          <WandSparkles />
          Generate timeline
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentProjects({ projects }: { projects: ProjectRecord[] }) {
  return (
    <div className="grid gap-3">
      {projects.map((project) => (
        <div
          className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-muted"
          key={project.id}
        >
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-muted">
            <Clapperboard className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{project.title}</div>
            <div className="mt-1 truncate text-sm text-muted-foreground">
              {project.repoName} - {project.stack} - {project.steps} steps
            </div>
          </div>
          <Badge variant="secondary">Timeline</Badge>
        </div>
      ))}
    </div>
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
