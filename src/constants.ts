import type { Service, ServiceColor } from './types'

export const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Nginx',
    url: 'http://127.0.0.1:8080',
    description: 'Servidor Web Principal e Proxy Reverso.',
    icon: 'globe',
    badge: '8080',
    color: 'cyan',
  },
  {
    id: '2',
    title: 'Apache',
    url: 'http://127.0.0.1:8081',
    description: 'Servidor Web Secundário (HTTPD).',
    icon: 'server',
    badge: '8081',
    color: 'violet',
  },
  {
    id: '3',
    title: 'pgAdmin',
    url: 'http://127.0.0.1:5050',
    description: 'Gerenciador de Banco de Dados PostgreSQL.',
    icon: 'database',
    badge: '5050',
    color: 'amber',
    footer: 'User: admin@admin.com',
  },
  {
    id: '4',
    title: 'Portainer',
    url: 'http://127.0.0.1:8080/portainer/',
    description: 'Gerenciamento visual de Containers Docker.',
    icon: 'layers',
    badge: 'Portainer',
    color: 'sky',
  },
  {
    id: '5',
    title: 'Portainer TLS',
    url: 'https://127.0.0.1:9443',
    description: 'Acesso direto via HTTPS ao Portainer.',
    icon: 'box',
    badge: '9443',
    color: 'sky',
  },
]

export const AVAILABLE_COLORS: ServiceColor[] = [
  'cyan',
  'violet',
  'amber',
  'sky',
  'emerald',
  'rose',
  'indigo',
  'fuchsia',
]

export const AVAILABLE_ICONS = [
  'globe',
  'server',
  'database',
  'layers',
  'box',
  'terminal',
  'code',
  'settings',
  'hard-drive',
  'network',
  'shield',
  'key',
  'mail',
  'message-square',
  'book-open',
  'bar-chart-3',
  'activity',
  'cpu',
  'folder',
  'git-branch',
] as const

export type IconName = (typeof AVAILABLE_ICONS)[number]
