import {
  legacyProjectStorageKey,
  projectStorageKey,
  projectStoragePrefixes,
  type StoredProject,
} from "@/lib/project-types";

export const projectUpdatedEvent = "tutoriallab-project-updated";

export function subscribeToProjectStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(projectUpdatedEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(projectUpdatedEvent, onStoreChange);
  };
}

export function readStoredProjectSnapshot(projectId: string) {
  return (
    window.localStorage.getItem(projectStorageKey(projectId)) ??
    window.localStorage.getItem(legacyProjectStorageKey(projectId))
  );
}

export function saveStoredProject(project: StoredProject) {
  window.localStorage.setItem(projectStorageKey(project.id), JSON.stringify(project));
  window.dispatchEvent(new Event(projectUpdatedEvent));
}

export function readStoredProjectsSnapshot() {
  const projects = new Map<string, StoredProject>();

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key || !projectStoragePrefixes.some((prefix) => key.startsWith(prefix))) {
      continue;
    }

    const value = window.localStorage.getItem(key);
    if (!value) {
      continue;
    }

    try {
      const project = JSON.parse(value) as StoredProject;
      projects.set(project.id, project);
    } catch {
      // Ignore old or malformed local MVP records.
    }
  }

  return JSON.stringify(
    Array.from(projects.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6),
  );
}
