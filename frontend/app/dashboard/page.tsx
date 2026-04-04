'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { logoutUser } from '@/lib/auth';
import api from '@/lib/api';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type TaskFormState = {
  title: string;
  description: string;
};

type ApiTasksResponse = {
  data: {
    tasks: Task[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

const PAGE_SIZE = 6;

const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

const getTaskStatusLabel = (task: Task) => {
  if (task.status) return 'done';
  if (task.description && task.description.trim().length > 0) return 'in-progress';
  return 'todo';
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [form, setForm] = useState<TaskFormState>({ title: '', description: '' });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const normalizedStatusForQuery = useMemo(() => {
    if (statusFilter === 'done') return true;
    if (statusFilter === 'todo' || statusFilter === 'in-progress') return false;
    return undefined;
  }, [statusFilter]);

  const fetchTasks = async (targetPage = 1, shouldAppend = false) => {
    try {
      setIsLoading(!shouldAppend);
      const params: Record<string, string | number | boolean> = {
        page: targetPage,
        limit: PAGE_SIZE,
      };

      if (search) params.search = search;
      if (normalizedStatusForQuery !== undefined) params.status = normalizedStatusForQuery;

      const { data } = await api.get<ApiTasksResponse>('/tasks', { params });

      const incomingTasks = data.data.tasks;
      const mergedTasks = shouldAppend ? [...tasks, ...incomingTasks] : incomingTasks;

      setTasks(mergedTasks);
      setHasNextPage(data.data.pagination.hasNextPage);
      setPage(targetPage);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, normalizedStatusForQuery]);

  const visibleTasks = useMemo(() => {
    if (statusFilter === 'in-progress') {
      return tasks.filter((task) => getTaskStatusLabel(task) === 'in-progress');
    }

    if (statusFilter === 'todo') {
      return tasks.filter((task) => getTaskStatusLabel(task) === 'todo');
    }

    return tasks;
  }, [statusFilter, tasks]);

  const resetForm = () => setForm({ title: '', description: '' });

  const handleLogout = () => {
    logoutUser();
    toast.success('You have been logged out.');
    router.replace('/login');
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (task: Task) => {
    setForm({ title: task.title, description: task.description ?? '' });
    setEditingTask(task);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingTask(null);
    resetForm();
  };

  const handleCreateOrEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, {
          title: form.title,
          description: form.description,
        });
        toast.success('Task updated.');
      } else {
        await api.post('/tasks', {
          title: form.title,
          description: form.description,
        });
        toast.success('Task created.');
      }

      closeModals();
      await fetchTasks(1, false);
    } catch {
      toast.error('Something went wrong while saving your task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    const snapshot = tasks;
    setTasks((previous) => previous.filter((task) => task.id !== taskId));

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted.');
    } catch {
      setTasks(snapshot);
      toast.error('Could not delete task.');
    }
  };

  const handleToggle = async (taskId: string) => {
    const snapshot = tasks;
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: !task.status,
            }
          : task
      )
    );

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
    } catch {
      setTasks(snapshot);
      toast.error('Could not update status.');
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-7xl gap-4 lg:gap-6">
          <aside className="glass-card hidden w-64 shrink-0 rounded-2xl p-5 md:block">
            <div className="flex items-center gap-2 text-xl font-semibold text-white">
              <CheckSquare className="h-5 w-5 text-indigo-300" /> TaskFlow
            </div>
            <nav className="mt-8 space-y-2">
              <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-100"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </aside>

          <section className="flex-1">
            <header className="glass-card rounded-2xl p-4 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search tasks..."
                    className="h-11 w-full rounded-xl border border-white/20 bg-black/25 pl-10 pr-4 text-sm text-white outline-none ring-indigo-400 focus:ring-2"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as typeof statusFilter);
                      setPage(1);
                    }}
                    className="h-11 rounded-xl border border-white/20 bg-black/20 px-3 text-sm text-white outline-none ring-indigo-400 focus:ring-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    <Plus className="h-4 w-4" /> Create Task
                  </button>
                </div>
              </div>
            </header>

            {isLoading ? (
              <div className="mt-5 text-sm text-slate-300">Loading tasks...</div>
            ) : (
              <>
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2"
                >
                  {visibleTasks.map((task) => {
                    const statusLabel = getTaskStatusLabel(task);
                    const badgeClass =
                      statusLabel === 'done'
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                        : statusLabel === 'in-progress'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                          : 'bg-sky-500/20 text-sky-200 border-sky-400/40';

                    return (
                      <motion.article
                        key={task.id}
                        variants={listItem}
                        className="glass-card rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={task.status}
                              onChange={() => handleToggle(task.id)}
                              className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-indigo-400"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                              <p className="mt-2 text-sm text-slate-300">
                                {task.description?.trim() || 'No description provided.'}
                              </p>
                            </div>
                          </div>

                          <details className="relative">
                            <summary className="list-none rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </summary>
                            <div className="absolute right-0 z-10 mt-2 w-24 rounded-xl border border-white/15 bg-slate-900/95 p-1 text-sm shadow-xl">
                              <button
                                type="button"
                                onClick={() => openEditModal(task)}
                                className="w-full rounded-lg px-2 py-1 text-left hover:bg-white/10"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(task.id)}
                                className="mt-1 w-full rounded-lg px-2 py-1 text-left text-rose-300 hover:bg-rose-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </details>
                        </div>

                        <span className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${badgeClass}`}>
                          {statusLabel.replace('-', ' ')}
                        </span>
                      </motion.article>
                    );
                  })}
                </motion.div>

                {visibleTasks.length === 0 && (
                  <div className="mt-5 rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-300">
                    No tasks found for this view.
                  </div>
                )}

                {hasNextPage && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => fetchTasks(page + 1, true)}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {(isCreateOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <button type="button" onClick={closeModals} className="rounded-lg p-1 text-slate-300 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrEdit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-200">Title</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/20 bg-black/20 px-3 text-sm text-white outline-none ring-indigo-400 focus:ring-2"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-200">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-indigo-400 focus:ring-2"
                  placeholder="Task details"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
