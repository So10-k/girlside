import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import type { ProjectRecord } from '../store/persistence';
import { useAppStore } from '../store/useAppStore';

export default function ProjectNameField({ project }: { project: ProjectRecord }) {
  const renameProject = useAppStore((s) => s.renameProject);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(project.name);
  }, [project.id, project.name]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const clean = draft.trim() || project.name;
    if (clean !== project.name) renameProject(project.id, clean);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(project.name);
            setEditing(false);
          }
        }}
        className="font-semibold text-ink bg-white border border-lavender-200 rounded-lg px-2 py-0.5 focus:outline-none focus:shadow-ring"
      />
    );
  }

  return (
    <button
      className="group flex items-center gap-1 text-sm font-semibold truncate rounded-lg px-2 py-0.5 hover:bg-white/70"
      onClick={() => setEditing(true)}
      title="Rename project"
    >
      <span className="truncate">{project.name}</span>
      <Pencil size={12} className="opacity-0 group-hover:opacity-60" />
    </button>
  );
}
