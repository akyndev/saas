"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Captions,
  CircleHelp,
  Clapperboard,
  Code2,
  FileArchive,
  FlaskConical,
  Folder,
  GitBranch,
  Home,
  Library,
  Loader2,
  Mic2,
  Radio,
  Settings2,
  Video,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  projectStorageKey,
  type RepoInfo,
  type RepoRootItem,
  type StoredProject,
} from "@/lib/project-types";
import { projectUpdatedEvent, readStoredProjectsSnapshot, subscribeToProjectStorage } from "@/lib/project-storage";

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

const sidebarRow = "w-[calc(var(--sidebar-width)-1.5625rem)] rounded-[10px] px-2";
const sidebarLabel =
  "flex h-8 flex-1 translate-x-0 items-center justify-between opacity-100 transition-all duration-150 group-data-[collapsible=icon]:translate-x-1 group-data-[collapsible=icon]:opacity-0";

export function TutorialStudio() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("https://github.com/vercel/next.js");
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [rootItems, setRootItems] = useState<RepoRootItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function findRepository() {
    setError("");
    setRepoInfo(null);
    setRootItems([]);
    setTotalSize(0);
    setIsLoading(true);

    try {
      const parsed = parseGitHubUrl(repoUrl);
      if (!parsed) {
        throw new Error("Enter a public GitHub repo URL like https://github.com/owner/repo");
      }

      const repoData = await fetchGitHubJson(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      const branch = repoData.default_branch;
      const contents = await fetchGitHubJson(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents?ref=${branch}`,
      );
      const items = Array.isArray(contents) ? contents : [];

      setRepoInfo({
        defaultBranch: branch,
        description: repoData.description,
        fullName: repoData.full_name,
        htmlUrl: repoData.html_url,
      });
      const rootWithSizes = await Promise.all(
        items.map(async (item) => {
          const size = item.type === "dir" ? await getDirectorySize(item.url) : item.size ?? 0;

          return {
            name: item.name,
            path: item.path,
            size,
            type: item.type,
          };
        }),
      );

      setTotalSize(rootWithSizes.reduce((sum, item) => sum + (item.size ?? 0), 0));
      setRootItems(
        rootWithSizes
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
            return a.name.localeCompare(b.name);
          }),
      );
    } catch (caughtError) {
      setError(formatFetchError(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  function createWorkspace() {
    if (!repoInfo) {
      return;
    }

    const projectId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;
    const project: StoredProject = {
      createdAt: new Date().toISOString(),
      id: projectId,
      repoInfo,
      repoUrl,
      rootItems,
      status: "overview",
      totalSize,
    };

    window.localStorage.setItem(projectStorageKey(projectId), JSON.stringify(project));
    window.dispatchEvent(new Event(projectUpdatedEvent));
    router.push(`/projects/${projectId}`);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13.25rem",
          "--sidebar-width-icon": "4.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset>
        <div className="min-w-0 bg-background text-foreground">
          <Topbar />

          <section className="mx-auto max-w-[1180px] px-6 py-24 lg:px-10">
            <div className="mb-10">
              {/*
              <Button
                className="mb-10 h-11 rounded-full border bg-background px-3 pr-5 text-sm shadow-none"
                variant="outline"
              >
                <Badge className="rounded-full bg-foreground px-3 text-background">New</Badge>
                Timeline renderer is ready for MVP testing
              </Button>
              */}

              <p className="text-sm font-medium text-muted-foreground">My Workspace</p>
              <h1 className="mt-1 text-4xl font-medium tracking-tight md:text-5xl">
                Good morning, Joseph
              </h1>
            </div>

            <div className="max-w-3xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Create from GitHub repo</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Paste a public GitHub repository link. For this MVP step we read the repo metadata
                  and show the root folders and files.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Code2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-12 pl-10"
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={(event) => setRepoUrl(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void findRepository();
                      }
                    }}
                  />
                </div>
                <Button className="h-12 px-5" disabled={isLoading} onClick={findRepository}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <WandSparkles />}
                  Find repo
                </Button>
              </div>

              {error ? (
                <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <RecentWorkspaces />

              {repoInfo ? (
                <div className="mt-8">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold">{repoInfo.fullName}</h3>
                        <Badge variant="secondary">
                          <GitBranch className="size-3" />
                          {repoInfo.defaultBranch}
                        </Badge>
                        <Badge variant="outline">{formatBytes(totalSize)} estimated</Badge>
                      </div>
                    </div>
                    <Button onClick={createWorkspace}>
                      <Video />
                      Create workspace
                    </Button>
                  </div>
                  {repoInfo.description ? (
                    <p className="mb-5 text-sm leading-6 text-muted-foreground">
                      {repoInfo.description}
                    </p>
                  ) : null}

                  <div className="overflow-hidden rounded-2xl border bg-background">
                    <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3 text-sm font-semibold">
                      <span>Root structure</span>
                      <span className="text-muted-foreground">{formatBytes(totalSize)}</span>
                    </div>
                    <div className="divide-y">
                      {rootItems.map((item) => (
                        <div className="flex items-center gap-3 px-4 py-3" key={item.path}>
                          <div className="grid size-8 place-items-center rounded-lg bg-muted">
                            {item.type === "dir" ? (
                              <Folder className="size-4 text-muted-foreground" />
                            ) : (
                              <FileArchive className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 truncate text-sm font-medium">
                            {item.name}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.size === null ? "-" : formatBytes(item.size)}
                          </span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function RecentWorkspaces() {
  const storedProjects = useSyncExternalStore(
    subscribeToProjectStorage,
    readStoredProjectsSnapshot,
    () => undefined,
  );
  const projects = useMemo(() => {
    if (!storedProjects) {
      return [];
    }

    try {
      return JSON.parse(storedProjects) as StoredProject[];
    } catch {
      return [];
    }
  }, [storedProjects]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recent workspaces</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Continue from a saved project without pasting the repo link again.
          </p>
        </div>
        <Badge variant="outline">{projects.length}</Badge>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="divide-y">
          {projects.map((project) => (
            <Link
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/40"
              href={`/projects/${project.id}`}
              key={project.id}
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Folder className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{project.repoInfo.fullName}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatBytes(project.totalSize)}</span>
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>
              <Badge variant={project.status === "overview" ? "outline" : "secondary"}>
                {formatProjectStatus(project.status)}
              </Badge>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatProjectStatus(status: StoredProject["status"]) {
  const labels: Record<StoredProject["status"], string> = {
    analyzed: "Understood",
    overview: "Overview",
    planned: "Planned",
    scripted: "Scripted",
    timelined: "Timeline",
    "tts-ready": "TTS ready",
  };

  return labels[status];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AppSidebar() {
  return (
    <Sidebar className="overflow-hidden border-r bg-[#f8f8f8]" collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex h-9 items-center gap-2 px-2 pb-4 text-[21px] font-black leading-none tracking-tight">
          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-foreground text-background">
            <FlaskConical className="size-4" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">TutorialLab</span>
        </div>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={`${sidebarRow} h-9`} tooltip="Developers">
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
  icon: LucideIcon;
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
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-5">
        <SidebarTrigger className="size-8" />
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

function parseGitHubUrl(value: string) {
  try {
    const url = new URL(value.trim());
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.hostname !== "github.com" || parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

async function getDirectorySize(url: string) {
  try {
    const contents = await fetchGitHubJson(url);

    if (!Array.isArray(contents)) {
      return null;
    }

    return contents.reduce((sum, item) => {
      if (item.type !== "file") {
        return sum;
      }

      return sum + (item.size ?? 0);
    }, 0);
  } catch {
    return null;
  }
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

  if (response.status === 404) {
    throw new Error("Repo not found or not public.");
  }

  if (response.status === 403) {
    throw new Error("GitHub rate-limited this browser. Wait a bit, then try again.");
  }

  if (!response.ok) {
    throw new Error("GitHub could not return this repo right now. Try again in a moment.");
  }

  return response.json();
}

function formatFetchError(caughtError: unknown) {
  if (caughtError instanceof Error) {
    return caughtError.message === "Failed to fetch"
      ? "Could not reach GitHub. Check your connection and try again."
      : caughtError.message;
  }

  return "Something went wrong.";
}

export function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}
