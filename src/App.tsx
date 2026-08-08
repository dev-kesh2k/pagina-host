import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  LayoutGrid,
  Zap,
  Rocket,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react'
import { ServiceCard } from './components/ServiceCard'
import { ServiceModal } from './components/ServiceModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import type { Service } from './types'
import { DEFAULT_SERVICES } from './constants'
import { useTheme } from './hooks/useTheme'

const STORAGE_KEY = 'kesh-dashboard-services:v1'

function App() {
  const { theme, toggleTheme } = useTheme()

  const [services, setServices] = useState<Service[]>([])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Service[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed)
          setLoaded(true)
          return
        }
      }
    } catch (e) {
      // fallback
    }
    setServices(DEFAULT_SERVICES)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services))
    } catch (e) {
      // ignore
    }
  }, [services, loaded])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return services
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        (s.footer ?? '').toLowerCase().includes(q),
    )
  }, [services, search])

  const openAdd = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (id: string) => {
    setEditingId(id)
    setModalOpen(true)
  }

  const editingService = editingId
    ? services.find((s) => s.id === editingId) ?? null
    : null

  const saveService = (data: Omit<Service, 'id'> & { id?: string }) => {
    if (data.id) {
      setServices((prev) =>
        prev.map((s) => (s.id === data.id ? { ...s, ...data, id: data.id! } : s)),
      )
    } else {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      setServices((prev) => [{ ...data, id }, ...prev])
    }
  }

  const confirmDelete = (id: string) => setDeleteId(id)

  const performDelete = () => {
    if (!deleteId) return
    setServices((prev) => prev.filter((s) => s.id !== deleteId))
    setDeleteId(null)
  }

  const resetDefaults = () => {
    if (
      window.confirm(
        'Deseja restaurar os serviços padrão? Isso substituirá seus serviços atuais.',
      )
    ) {
      setServices(DEFAULT_SERVICES)
    }
  }

  const deletingService = services.find((s) => s.id === deleteId)

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 dark:opacity-40" />
      <div className="gradient-blob -left-40 -top-40 h-[28rem] w-[28rem] bg-cyan-400 dark:bg-cyan-500" />
      <div className="gradient-blob -right-32 top-24 h-96 w-96 bg-violet-400 dark:bg-violet-600" />
      <div className="gradient-blob -bottom-32 left-1/3 h-96 w-96 bg-fuchsia-400 dark:bg-fuchsia-500" />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <header className="mb-8 animate-fade-in">
          <div className="rounded-3xl border border-slate-200/80 bg-white/75 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-slate-950/30">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/25">
                    <Rocket className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                      <Zap className="h-3.5 w-3.5" />
                      Painel Local
                    </div>
                    <h1 className="mt-3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl dark:from-slate-50 dark:via-slate-200 dark:to-slate-400">
                      Kesh Dashboard
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                      Acesse seus serviços Docker de forma rápida e segura, em
                      uma interface elegante.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-start">
                  <div className="hidden flex-wrap gap-2 content-center sm:flex sm:col-span-2">
                    {['Nginx', 'Apache', 'pgAdmin', 'Portainer'].map((t) => (
                      <span
                        key={t}
                        className="self-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-500 dark:border-slate-700/60 dark:bg-slate-950/60 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-white/80 px-5 py-4 text-slate-700 ring-1 ring-inset ring-slate-200/80 shadow-inner shadow-slate-900/5 dark:bg-slate-950/80 dark:text-slate-300 dark:ring-slate-800/60 dark:shadow-inner dark:shadow-slate-900/40">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      Serviços
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {services.length}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-500">
                        ativos
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 animate-slide-up">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar serviços, portas, URLs..."
                className="w-full rounded-2xl border border-slate-200 bg-white/85 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
              />
              {search && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700/60 dark:bg-slate-950/80 dark:text-slate-400">
                  {filtered.length} resultado
                  {filtered.length === 1 ? '' : 's'}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-800 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                title={
                  theme === 'dark'
                    ? 'Mudar para tema claro'
                    : 'Mudar para tema escuro'
                }
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {theme === 'dark' ? 'Claro' : 'Escuro'}
                </span>
              </button>

              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-800 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                title="Restaurar padrões"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Restaurar</span>
              </button>

              <button
                onClick={openAdd}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:via-sky-400 hover:to-indigo-400 hover:shadow-xl hover:shadow-cyan-500/35"
              >
                <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                Adicionar Serviço
              </button>
            </div>
          </div>
        </section>

        <main>
          {filtered.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center animate-fade-in dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:ring-slate-700/60">
                <LayoutGrid className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-800 dark:text-slate-200">
                {search
                  ? 'Nenhum serviço encontrado'
                  : 'Nenhum serviço adicionado'}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {search
                  ? 'Tente outros termos de busca ou limpe o filtro.'
                  : 'Comece adicionando seu primeiro app ao painel. É rápido e fácil.'}
              </p>
              {!search && (
                <button
                  onClick={openAdd}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar meu primeiro serviço
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((service, idx) => (
                <div
                  key={service.id}
                  style={{ animationDelay: `${Math.min(idx, 16) * 35}ms` }}
                >
                  <ServiceCard
                    service={service}
                    onDelete={confirmDelete}
                    onEdit={openEdit}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="mt-16 pb-6 text-center text-xs text-slate-400 dark:text-slate-600">
          Kesh Dashboard • Feito com ❤️ para gerenciar seus containers locais
        </footer>
      </div>

      <ServiceModal
        open={modalOpen}
        editing={editingService}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
        }}
        onSave={saveService}
      />

      <DeleteConfirmModal
        open={deleteId !== null}
        serviceTitle={deletingService?.title}
        onClose={() => setDeleteId(null)}
        onConfirm={performDelete}
      />
    </div>
  )
}

export default App
