import { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Check,
  Save,
  Globe,
  Server,
  Database,
  Layers,
  Box,
  Terminal,
  Code,
  Settings,
  HardDrive,
  Network,
  Shield,
  Key,
  Mail,
  MessageSquare,
  BookOpen,
  BarChart3,
  Activity,
  Cpu,
  Folder,
  GitBranch,
  LucideIcon,
} from 'lucide-react'
import type { Service, ServiceColor } from '../types'
import { AVAILABLE_COLORS, AVAILABLE_ICONS, type IconName } from '../constants'

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  server: Server,
  database: Database,
  layers: Layers,
  box: Box,
  terminal: Terminal,
  code: Code,
  settings: Settings,
  'hard-drive': HardDrive,
  network: Network,
  shield: Shield,
  key: Key,
  mail: Mail,
  'message-square': MessageSquare,
  'book-open': BookOpen,
  'bar-chart-3': BarChart3,
  activity: Activity,
  cpu: Cpu,
  folder: Folder,
  'git-branch': GitBranch,
}

interface ServiceModalProps {
  open: boolean
  editing?: Service | null
  onClose: () => void
  onSave: (data: Omit<Service, 'id'> & { id?: string }) => void
}

export function ServiceModal({ open, editing, onClose, onSave }: ServiceModalProps) {
  const isEditing = Boolean(editing)

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<string>('globe')
  const [badge, setBadge] = useState('')
  const [color, setColor] = useState<ServiceColor>('cyan')
  const [footer, setFooter] = useState('')

  useEffect(() => {
    if (!open) return
    if (editing) {
      setTitle(editing.title)
      setUrl(editing.url)
      setDescription(editing.description)
      setIcon(editing.icon)
      setBadge(editing.badge)
      setColor(editing.color)
      setFooter(editing.footer ?? '')
    } else {
      setTitle('')
      setUrl('')
      setDescription('')
      setIcon('globe')
      setBadge('')
      setColor('cyan')
      setFooter('')
    }
  }, [open, editing])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    onSave({
      id: editing?.id,
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || 'Sem descrição.',
      icon,
      badge: badge.trim() || (isEditing ? editing!.badge : 'Novo'),
      color,
      footer: footer.trim() || undefined,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/80"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        <div className="glass-card overflow-hidden rounded-3xl border-slate-200 shadow-2xl shadow-slate-900/20 dark:border-slate-700/50 dark:shadow-slate-950/50">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800/60">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isEditing
                  ? 'Atualize as informações do seu app.'
                  : 'Adicione um novo app ao seu painel.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-400 hover:text-slate-800 dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome do serviço <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Grafana"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://127.0.0.1:3000"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva brevemente o serviço..."
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Badge (Porta/Nome)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="3000"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cor
                </label>
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700/60 dark:bg-slate-900/70">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-${c}-500/20 text-${c}-700 transition-all hover:scale-110 dark:text-${c}-300 ${
                        color === c
                          ? `ring-2 ring-${c}-400/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110`
                          : ''
                      }`}
                      title={c}
                    >
                      {color === c && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ícone
                </label>
                <div className="scrollbar-hide grid max-h-40 grid-cols-5 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-10 dark:border-slate-700/60 dark:bg-slate-900/70">
                  {AVAILABLE_ICONS.map((i) => (
                    <IconOption
                      key={i}
                      iconName={i}
                      selected={icon === i}
                      color={color}
                      onClick={() => setIcon(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Informação extra (opcional)
                </label>
                <input
                  type="text"
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  placeholder="User: admin@admin.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400/40"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:text-slate-900 sm:flex-none dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-sky-400 hover:shadow-cyan-500/30 sm:flex-none"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    Adicionar Serviço
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function IconOption({
  iconName,
  selected,
  color,
  onClick,
}: {
  iconName: IconName
  selected: boolean
  color: ServiceColor
  onClick: () => void
}) {
  const Ic = ICON_MAP[iconName] || Globe
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
        selected
          ? `border-${color}-400/40 bg-${color}-500/20 text-${color}-700 ring-1 ring-${color}-400/30 dark:text-${color}-300`
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700/40 dark:bg-slate-950/50 dark:hover:border-slate-600 dark:hover:text-slate-300'
      }`}
    >
      <Ic className="h-4 w-4" />
    </button>
  )
}
