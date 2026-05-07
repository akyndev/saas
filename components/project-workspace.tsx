"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowLeft } from "lucide-react";
import { AppSidebar, Topbar } from "@/components/tutorial-studio";
import { WorkspaceOverview } from "@/components/project-workspace/workspace-overview";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { readStoredProjectSnapshot, subscribeToProjectStorage } from "@/lib/project-storage";
import type { StoredProject } from "@/lib/project-types";

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const storedProject = useSyncExternalStore(
    subscribeToProjectStorage,
    () => readStoredProjectSnapshot(projectId),
    () => undefined,
  );
  const project = useMemo(() => parseStoredProject(storedProject), [storedProject]);
  const missingProject = storedProject === null || (storedProject !== undefined && !project);

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

          <section className="mx-auto max-w-[1180px] px-6 py-16 lg:px-10">
            {missingProject ? <MissingProject /> : null}
            {!missingProject && !project ? <LoadingProject /> : null}
            {project ? <WorkspaceOverview project={project} /> : null}
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function parseStoredProject(storedProject: string | null | undefined) {
  if (!storedProject) {
    return null;
  }

  try {
    return JSON.parse(storedProject) as StoredProject;
  } catch {
    return null;
  }
}

function MissingProject() {
  return (
    <div className="max-w-xl">
      <Button asChild className="mb-8" variant="outline">
        <Link href="/">
          <ArrowLeft />
          Back home
        </Link>
      </Button>
      <h1 className="text-3xl font-semibold tracking-tight">Workspace not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This MVP stores projects in this browser for now. Create the workspace again from a public GitHub repo and it
        will open here.
      </p>
    </div>
  );
}

function LoadingProject() {
  return (
    <div className="max-w-xl">
      <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
    </div>
  );
}
