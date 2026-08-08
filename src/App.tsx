import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, LayoutGrid, Zap, Rocket, RotateCcw } from 'lucide-react'
import { ServiceCard } from './components/ServiceCard'
import { AddServiceModal } from './components/AddServiceModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import type { Service } from './types'
import { DEFAULT_SERVICES } from './constants'

const STORAGE_KEY = 'kesh-dashboard-services:v1'

function App() {
  const [services, setServices] = useState<Service[]>([])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
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

  const addService = (data: Omit<Service, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setServices((prev) => [{ ...data, id }, ...prev])
  }

  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

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
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="gradient-blob -left-32 -top-32 h-96 w-96 bg-cyan-500" />
      <div className="gradient-blob -right-24 top-40 h-80 w-80 bg-violet-600" />
      <div className="gradient-blob bottom-0 left-1/3 h-80 w-80 bg-fuchsia-500" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fade-in">
          <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 p-8 shadow-xl shadow-slate-950/30 backdrop-blur">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
                  <Zap className="h-3.5 w-3.5" />
                  Painel Local
                </div>
                <h1 className="mt-4 bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                  Kesh Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
                  Acesse seus serviços Docker de forma rápida e segura, em uma
                  interface escura elegante.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
                <div className="rounded-2xl bg-slate-950/80 px-5 py-4 text-slate-300 shadow-inner shadow-slate-900/40 ring-1 ring-inset ring-slate-800/60">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Serviços
                  </p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-50">
                      {services.length}
                    </span>
                    <span className="text-sm text-slate-500">ativos</span>
                  </p>
                </div>
                <div className="hidden items-start gap-3 sm:flex">
                  <div className="flex flex-wrap gap-2">
                    {['Nginx', 'Apache', 'pgAdmin', 'Portainer'].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-700/60 bg-slate-950/60 px-3 py-1 text-xs text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 animate-slide-up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar serviços, portas, URLs..."
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none backdrop-blur transition-all focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
              />
              {search && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/60 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-400">
                  {filtered.length} resultado
                  {filtered.length === 1 ? '' : 's'}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/80 hover:text-slate-100"
                title="Restaurar padrões"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Restaurar</span>
              </button>

              <button
                onClick={() => setAddOpen(true)}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:via-sky-400 hover:to-indigo-400 hover:shadow-cyan-500/35 hover:shadow-xl"
              >
                <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                Adicionar Serviço
                <Rocket className="hidden h-4 w-4 sm:block" />
              </button>
            </div>
          </div>
        </section>

        <main>
          {filtered.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800/60 text-slate-500 ring-1 ring-inset ring-slate-700/60">
                <LayoutGrid className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-200">
                {search ? 'Nenhum serviço encontrado' : 'Nenhum serviço adicionado'}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                {search
                  ? 'Tente outros termos de busca ou limpe o filtro.'
                  : 'Comece adicionando seu primeiro app ao painel. É rápido e fácil.'}
              </p>
              {!search && (
                <button
                  onClick={() => setAddOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar meu primeiro serviço
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((service, idx) => (
                <div
                  key={service.id}
                  style={{ animationDelay: `${Math.min(idx, 12) * 40}ms` }}
                >
                  <ServiceCard service={service} onDelete={confirmDelete} />
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="mt-16 pb-6 text-center text-xs text-slate-600">
          Kesh Dashboard • Feito com ❤️ para gerenciar seus containers locais
        </footer>
      </div>

      <AddServiceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={addService}
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
