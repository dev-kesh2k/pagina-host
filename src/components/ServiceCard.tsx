import {
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
  ExternalLink,
  Trash2,
} from 'lucide-react'
import type { Service } from '../types'

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

interface ServiceCardProps {
  service: Service
  onDelete: (id: string) => void
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const IconComponent = ICON_MAP[service.icon] || Globe

  return (
    <div
      className={`card-hover glass-card group relative overflow-hidden rounded-3xl p-6 animate-slide-up hover:bg-slate-800/90 hover:border-${service.color}-400/40`}
      style={{ animationDelay: '0ms' }}
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete(service.id)
        }}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80 text-slate-400 opacity-0 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100"
        title="Excluir serviço"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <a
        href={service.url}
        target="_blank"
        rel="noreferrer"
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${service.color}-500/15 text-${service.color}-300 shadow-md shadow-${service.color}-500/10 ring-1 ring-inset ring-${service.color}-400/20 transition-transform duration-300 group-hover:scale-110`}
            >
              <IconComponent className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <div>
              <p
                className={`text-xs uppercase tracking-[0.25em] text-${service.color}-300/80`}
              >
                Serviço
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
                {service.title}
              </h2>
            </div>
          </div>

          <div
            className={`rounded-full border border-${service.color}-400/20 bg-slate-950/70 px-3 py-2 text-sm font-medium text-${service.color}-200`}
          >
            {service.badge}
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-slate-400">
          {service.description}
        </p>

        {service.footer && (
          <div className="mt-6 rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300 ring-1 ring-inset ring-slate-800/80">
            {service.footer}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate max-w-[220px]">{service.url}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium text-${service.color}-300 transition-transform duration-200 group-hover:translate-x-0.5`}
          >
            Abrir
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  )
}
